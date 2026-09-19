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
  paymentMethod: z.enum(['MTN_MOMO', 'AIRTEL_MONEY', 'CARD']).default('MTN_MOMO'),
  phoneNumber: z.string().optional(),
});

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

    if (
      (validated.paymentMethod === 'MTN_MOMO' || validated.paymentMethod === 'AIRTEL_MONEY') &&
      (!validated.phoneNumber || validated.phoneNumber.trim().length < 7)
    ) {
      res.status(400).json({
        success: false,
        message: 'A valid phone number is required for Mobile Money collections',
      });
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
    const formattedPhone = validated.phoneNumber ? formatPhoneNumber(validated.phoneNumber) : null;

    let gatewayResult;

    if (validated.paymentMethod === 'CARD') {
      gatewayResult = await collectCard({
        amount: order.totalAmount,
        reference,
        country: 'UG',
        currency: order.currency || 'UGX',
        description: `Order #${order.orderNumber} - Marvin Tattoo Atelier`,
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
        phoneNumber: formattedPhone || order.clientPhone,
        reference,
        country: 'UG',
        currency: order.currency || 'UGX',
        description: `Order #${order.orderNumber} - Marvin Tattoo Atelier`,
        callbackUrl: env.MARZPAY_CALLBACK_URL || undefined,
        metadata: [
          { orderId: order.id },
          { orderNumber: order.orderNumber },
          { customerEmail: order.clientEmail },
        ],
      });
    }

    const initialStatus = gatewayResult.status === 'completed' ? 'SUCCESS' : 'PENDING';

    const transaction = await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        gateway: 'MARZPAY',
        gatewayRef: gatewayResult.uuid,
        merchantTxRef: reference,
        amount: order.totalAmount,
        currency: order.currency,
        paymentMethod: validated.paymentMethod,
        phoneNumber: formattedPhone,
        status: initialStatus,
      },
    });

    const instruction =
      validated.paymentMethod === 'CARD'
        ? 'Redirecting to secure card payment gateway...'
        : `A payment prompt has been dispatched to ${formattedPhone || validated.phoneNumber}. Please authorize on your handset by entering your secret PIN.`;

    res.json({
      success: true,
      message: gatewayResult.message || 'Payment initialized successfully',
      data: {
        transactionId: transaction.id,
        merchantTxRef: reference,
        uuid: gatewayResult.uuid,
        status: initialStatus,
        instruction,
        authUrl: gatewayResult.redirectUrl || null,
        isSandbox: gatewayResult.isSandbox || env.MARZPAY_MODE === 'sandbox',
        paymentMethod: validated.paymentMethod,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    console.error('initializePayment error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to initialize payment' });
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

    // If already marked SUCCESS
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

    // MarzPay Gateway Verification
    if (transaction.gateway === 'MARZPAY' && transaction.gatewayRef) {
      const statusRes = await getCollectionStatus(transaction.gatewayRef);

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

        res.json({
          success: true,
          data: {
            status: 'FAILED',
            orderNumber: transaction.order.orderNumber,
          },
        });
        return;
      }

      res.json({
        success: true,
        data: {
          status: 'PROCESSING',
          orderNumber: transaction.order.orderNumber,
        },
      });
      return;
    }

    // Legacy Flutterwave verification fallback
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

    // Mock development auto-approval if no keys configured
    if (!env.MARZPAY_API_KEY && !env.FLW_SECRET_KEY) {
      const updatedTx = await prisma.paymentTransaction.update({
        where: { id: transaction.id },
        data: {
          status: 'SUCCESS',
          paidAt: new Date(),
          providerTxId: `MOCK-${Date.now()}`,
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
          isMock: true,
        },
      });
      return;
    }

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
    // MarzPay can send direct callback or { data: ... } wrapper
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
        if (eventType === 'collection.completed' || status === 'completed' || status === 'success') {
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
  // If MarzPay webhook headers are detected, delegate
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
