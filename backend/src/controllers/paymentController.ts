import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { env } from '../config/env.js';
import { initiateUgandaMobileMoney, verifyFlutterwaveTransaction } from '../services/flutterwaveService.js';
import { z } from 'zod';

const initPaymentSchema = z.object({
  orderId: z.string().optional(),
  orderNumber: z.string().optional(),
  paymentMethod: z.enum(['MTN_MOMO', 'AIRTEL_MONEY', 'CARD']).default('MTN_MOMO'),
  phoneNumber: z.string().min(7, 'Phone number is required for mobile money'),
});

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

    const merchantTxRef = `TX-${order.orderNumber}-${Date.now()}`;
    const network = validated.paymentMethod === 'AIRTEL_MONEY' ? 'AIRTEL' : 'MTN';

    const gatewayResult = await initiateUgandaMobileMoney({
      txRef: merchantTxRef,
      amount: order.totalAmount,
      currency: order.currency,
      phoneNumber: validated.phoneNumber,
      email: order.clientEmail,
      fullName: order.clientName,
      network,
    });

    const transaction = await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        gateway: 'FLUTTERWAVE',
        gatewayRef: gatewayResult.gatewayRef || null,
        merchantTxRef,
        amount: order.totalAmount,
        currency: order.currency,
        paymentMethod: validated.paymentMethod,
        status: gatewayResult.status,
      },
    });

    res.json({
      success: true,
      message: gatewayResult.message,
      data: {
        transactionId: transaction.id,
        merchantTxRef,
        status: gatewayResult.status,
        instruction: gatewayResult.instruction,
        authUrl: gatewayResult.authUrl,
        isMock: gatewayResult.isMock,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    console.error('initializePayment error:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize payment' });
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  try {
    const merchantTxRef = req.params.txRef as string;

    const transaction = await prisma.paymentTransaction.findUnique({
      where: { merchantTxRef },
      include: { order: true },
    });

    if (!transaction) {
      res.status(404).json({ success: false, message: 'Transaction reference not found' });
      return;
    }

    if (transaction.status === 'SUCCESS') {
      res.json({
        success: true,
        data: {
          status: 'SUCCESS',
          paidAt: transaction.paidAt,
          orderNumber: transaction.order.orderNumber,
        },
      });
      return;
    }

    // In mock/test mode or with actual gateway
    if (!env.FLW_SECRET_KEY) {
      // Auto-approve in mock mode upon manual verification trigger
      const updatedTx = await prisma.paymentTransaction.update({
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
          paidAt: updatedTx.paidAt,
          orderNumber: transaction.order.orderNumber,
          isMock: true,
        },
      });
      return;
    }

    if (transaction.gatewayRef) {
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

export async function handleWebhook(req: Request, res: Response): Promise<void> {
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
