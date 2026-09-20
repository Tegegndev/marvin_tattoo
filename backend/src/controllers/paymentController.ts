import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import {
  collectMobileMoney,
  collectCard,
  getCollectionStatus,
  verifyWebhookSignature,
  formatPhoneNumber,
} from '../services/marzpayService.js';
import { verifyFlutterwaveTransaction } from '../services/flutterwaveService.js';
import { z } from 'zod';

const initPaymentSchema = z.object({
  orderId: z.string().optional(),
  orderNumber: z.string().optional(),
  paymentMethod: z.enum(['MTN_MOMO', 'AIRTEL_MONEY', 'MOMO', 'MOBILE_MONEY', 'CARD']).default('MOMO'),
  phoneNumber: z.string().optional(),
});

function detectUgandaCarrier(phone: string): 'MTN_MOMO' | 'AIRTEL_MONEY' {
  const digits = (phone || '').replace(/\D/g, '');
  let local = digits;
  if (local.startsWith('256')) {
    local = local.slice(3);
  } else if (local.startsWith('0')) {
    local = local.slice(1);
  }
  const p2 = local.slice(0, 2);
  if (['70', '75', '74', '20'].includes(p2)) {
    return 'AIRTEL_MONEY';
  }
  return 'MTN_MOMO';
}

/**
 * Initialize payment via MarzPay (Mobile Money or Card)
 */
export async function initializePayment(req: Request, res: Response): Promise<void> {
  try {
    const validated = initPaymentSchema.parse(req.body);

    if (!validated.orderId && !validated.orderNumber) {
      res.status(400).json({ success: false, message: 'Either orderId or orderNumber is required' });
      return;
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          ...(validated.orderId ? [{ id: validated.orderId }] : []),
          ...(validated.orderNumber ? [{ orderNumber: validated.orderNumber }] : []),
        ],
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    // Generate unique UUID v4 reference for MarzPay collection
    const reference = crypto.randomUUID();
    const rawPhone = validated.phoneNumber || order.clientPhone || '';
    const formattedPhone = rawPhone ? formatPhoneNumber(rawPhone) : order.clientPhone;

    const isCard = validated.paymentMethod === 'CARD';
    const effectiveMethod: 'MTN_MOMO' | 'AIRTEL_MONEY' | 'CARD' = isCard
      ? 'CARD'
      : detectUgandaCarrier(formattedPhone);

    if (!isCard && (!formattedPhone || formattedPhone.trim().length < 7)) {
      res.status(400).json({
        success: false,
        message: 'A valid MTN or Airtel phone number is required for mobile money payment',
      });
      return;
    }

    let gatewayResult;

    if (effectiveMethod === 'CARD') {
      gatewayResult = await collectCard({
        amount: order.totalAmount,
        reference,
        phoneNumber: formattedPhone,
        country: 'UG',
        currency: order.currency || 'UGX',
        description: `Order #${order.orderNumber} - Marvin Tattoo`,
        callbackUrl: env.MARZPAY_CALLBACK_URL || undefined,
        metadata: [
          { orderId: order.id },
          { orderNumber: order.orderNumber },
          { customerEmail: order.clientEmail },
        ],
      });
    } else {
      gatewayResult = await collectMobileMoney({
        amount: order.totalAmount,
        phoneNumber: formattedPhone,
        reference,
        country: 'UG',
        currency: order.currency || 'UGX',
        description: `Order #${order.orderNumber} - Marvin Tattoo`,
        callbackUrl: env.MARZPAY_CALLBACK_URL || undefined,
        metadata: [
          { orderId: order.id },
          { orderNumber: order.orderNumber },
          { customerEmail: order.clientEmail },
        ],
      });
    }

    if (order.paymentMethod !== effectiveMethod || (formattedPhone && order.clientPhone !== formattedPhone)) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentMethod: effectiveMethod,
          ...(formattedPhone ? { clientPhone: formattedPhone } : {}),
        },
      });
    }

    // All initiated collections strictly start as PENDING
    const transaction = await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        gateway: 'MARZPAY',
        gatewayRef: gatewayResult.uuid,
        merchantTxRef: reference,
        amount: order.totalAmount,
        currency: order.currency,
        paymentMethod: effectiveMethod,
        phoneNumber: formattedPhone,
        status: 'PENDING',
      },
    });

    const instruction =
      effectiveMethod === 'CARD'
        ? 'Please proceed to the card authorization window to complete payment.'
        : `A payment prompt has been sent to ${formattedPhone}. Please check your phone and enter your PIN.`;

    res.json({
      success: true,
      message: gatewayResult.message || 'Payment initiated successfully',
      data: {
        transactionId: transaction.id,
        merchantTxRef: reference,
        uuid: gatewayResult.uuid,
        status: 'PENDING',
        instruction,
        authUrl: gatewayResult.redirectUrl || null,
        isSandbox: gatewayResult.isSandbox || env.MARZPAY_MODE === 'sandbox',
        paymentMethod: effectiveMethod,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    console.error('initializePayment error:', error);
    let userMessage = error.message || 'Unable to initialize payment at this moment.';
    if (userMessage.includes('IP_NOT_WHITELISTED') || userMessage.includes('not whitelisted')) {
      userMessage =
        'The card payment gateway is currently undergoing security network verification. Please complete checkout using MTN MoMo or Airtel Money, or message studio concierge on WhatsApp.';
    } else if (userMessage.includes('fetch failed') || userMessage.includes('ECONNREFUSED')) {
      userMessage =
        'The payment network is temporarily unreachable. Please try again in a few seconds or use Mobile Money.';
    }
    res.status(400).json({ success: false, message: userMessage });
  }
}

/**
 * Verify payment status by reference or UUID
 */
export async function verifyPayment(req: Request, res: Response): Promise<void> {
  try {
    const ref = req.params.txRef as string;

    const transaction = await prisma.paymentTransaction.findFirst({
      where: {
        OR: [{ merchantTxRef: ref }, { gatewayRef: ref }, { id: ref }],
      },
      include: { order: true },
    });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaction reference not found' });
      return;
    }

    // 1. If already verified SUCCESS in database
    if (transaction.status === 'SUCCESS') {
      res.json({
        success: true,
        data: {
          status: 'SUCCESS',
          paidAt: transaction.paidAt,
          orderNumber: transaction.order.orderNumber,
          providerTxId: transaction.providerTxId,
        },
      });
      return;
    }

    // 2. If already marked FAILED in database
    if (transaction.status === 'FAILED') {
      res.json({
        success: true,
        data: {
          status: 'FAILED',
          orderNumber: transaction.order.orderNumber,
          reason: 'Transaction has failed or was cancelled.',
        },
      });
      return;
    }

    // 3. MarzPay Gateway Live Verification
    if (transaction.gateway === 'MARZPAY') {
      const queryRef = transaction.merchantTxRef || transaction.gatewayRef || ref;
      const statusRes = await getCollectionStatus(queryRef, transaction.phoneNumber);

      if (statusRes.status === 'completed') {
        const updatedTx = await prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'SUCCESS',
            paidAt: new Date(),
            providerTxId: statusRes.providerTxId || transaction.providerTxId,
          },
        });

        await prisma.order.update({
          where: { id: transaction.orderId },
          data: {
            paymentStatus: 'SUCCESS',
            orderStatus: 'PROCESSING',
          },
        });

        res.json({
          success: true,
          data: {
            status: 'SUCCESS',
            paidAt: updatedTx.paidAt,
            orderNumber: transaction.order.orderNumber,
            providerTxId: statusRes.providerTxId,
          },
        });
        return;
      }

      if (statusRes.status === 'failed' || statusRes.status === 'cancelled') {
        await prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: { status: 'FAILED' },
        });

        await prisma.order.update({
          where: { id: transaction.orderId },
          data: { paymentStatus: 'FAILED' },
        });

        res.json({
          success: true,
          data: {
            status: 'FAILED',
            orderNumber: transaction.order.orderNumber,
            reason: statusRes.reason || 'Transaction was declined by subscriber or bank.',
          },
        });
        return;
      }

      // Still pending / processing
      res.json({
        success: true,
        data: {
          status: 'PENDING',
          orderNumber: transaction.order.orderNumber,
          reason: statusRes.reason || 'Payment awaiting authorization on handset / 3D-Secure portal.',
        },
      });
      return;
    }

    // 4. Legacy Flutterwave verification fallback
    if (transaction.gatewayRef && env.FLW_SECRET_KEY) {
      const flwCheck = await verifyFlutterwaveTransaction(transaction.gatewayRef);
      if (flwCheck.success) {
        await prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'SUCCESS',
            paidAt: new Date(),
          },
        });

        await prisma.order.update({
          where: { id: transaction.orderId },
          data: {
            paymentStatus: 'SUCCESS',
            orderStatus: 'PROCESSING',
          },
        });

        res.json({
          success: true,
          data: {
            status: 'SUCCESS',
            paidAt: new Date(),
            orderNumber: transaction.order.orderNumber,
          },
        });
        return;
      }
    }

    // Default: Strictly remain in current database status, NEVER fake approve
    res.json({
      success: true,
      data: {
        status: transaction.status,
        orderNumber: transaction.order.orderNumber,
      },
    });
  } catch (error) {
    console.error('verifyPayment error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
}

/**
 * Handle incoming MarzPay webhooks & callbacks
 */
export async function handleMarzPayWebhook(req: Request, res: Response): Promise<void> {
  try {
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const signature = req.headers['x-marzpay-signature'] as string | undefined;
    const timestamp = req.headers['x-marzpay-timestamp'] as string | undefined;

    if (env.MARZPAY_WEBHOOK_SECRET && signature) {
      const isValid = verifyWebhookSignature(rawBody, signature, timestamp);
      if (!isValid) {
        res.status(401).json({ success: false, message: 'Invalid webhook signature' });
        return;
      }
    }

    const body = req.body;
    const payload = body.data || body;
    const eventType = body.event_type || payload.event_type || '';
    const tx = payload.transaction || {};
    const coll = payload.collection || {};

    const reference = tx.reference;
    const uuid = tx.uuid;
    const providerTxId = coll.provider_transaction_id;
    const status = (tx.status || '').toLowerCase();

    console.log(`[MarzPay Webhook received] event: ${eventType}, status: ${status}, ref: ${reference}`);

    if (reference || uuid) {
      const transaction = await prisma.paymentTransaction.findFirst({
        where: {
          OR: [
            ...(reference ? [{ merchantTxRef: reference }] : []),
            ...(uuid ? [{ gatewayRef: uuid }] : []),
          ],
        },
      });

      if (transaction) {
        if (eventType === 'collection.completed' || status === 'completed' || status === 'success' || status === 'successful') {
          await prisma.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
              status: 'SUCCESS',
              paidAt: new Date(),
              providerTxId: providerTxId || transaction.providerTxId,
              rawWebhookPayload: JSON.stringify(body),
            },
          });

          await prisma.order.update({
            where: { id: transaction.orderId },
            data: {
              paymentStatus: 'SUCCESS',
              orderStatus: 'PROCESSING',
            },
          });
        } else if (
          eventType === 'collection.failed' ||
          eventType === 'collection.cancelled' ||
          status === 'failed' ||
          status === 'cancelled'
        ) {
          await prisma.paymentTransaction.update({
            where: { id: transaction.id },
            data: {
              status: 'FAILED',
              rawWebhookPayload: JSON.stringify(body),
            },
          });

          await prisma.order.update({
            where: { id: transaction.orderId },
            data: {
              paymentStatus: 'FAILED',
            },
          });
        }
      }
    }

    res.status(200).json({ status: 'ok', success: true });
  } catch (error) {
    console.error('handleMarzPayWebhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook handler error' });
  }
}

/**
 * Handle legacy Flutterwave webhook
 */
export async function handleWebhook(req: Request, res: Response): Promise<void> {
  if (req.headers['x-marzpay-signature'] || req.body?.event_type?.startsWith('collection.')) {
    return handleMarzPayWebhook(req, res);
  }

  try {
    const signature = req.headers['verif-hash'];

    if (!signature || (env.FLW_SECRET_HASH && signature !== env.FLW_SECRET_HASH)) {
      res.status(401).json({ success: false, message: 'Invalid webhook signature' });
      return;
    }

    const payload = req.body;
    console.log('[Flutterwave Webhook received]:', JSON.stringify(payload));

    if (payload.event === 'charge.completed' && payload.data?.status === 'successful') {
      const txRef = payload.data.tx_ref;
      const transaction = await prisma.paymentTransaction.findUnique({
        where: { merchantTxRef: txRef },
      });

      if (transaction && transaction.status !== 'SUCCESS') {
        await prisma.paymentTransaction.update({
          where: { id: transaction.id },
          data: {
            status: 'SUCCESS',
            paidAt: new Date(),
            rawWebhookPayload: JSON.stringify(payload),
          },
        });

        await prisma.order.update({
          where: { id: transaction.orderId },
          data: {
            paymentStatus: 'SUCCESS',
            orderStatus: 'PROCESSING',
          },
        });
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('handleWebhook error:', error);
    res.status(500).json({ success: false, message: 'Webhook handler error' });
  }
}
