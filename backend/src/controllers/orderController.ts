import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { z } from 'zod';

const orderItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.coerce.number().int().positive('Quantity must be at least 1'),
});

const createOrderSchema = z.object({
  clientName: z.string().min(2, 'Full name is required'),
  clientPhone: z.string().min(7, 'Phone number is required'),
  clientEmail: z.string().email('Valid email is required'),
  deliveryMethod: z.enum(['STUDIO_PICKUP', 'KAMPALA_DISPATCH']).default('STUDIO_PICKUP'),
  deliveryAddress: z.string().optional().nullable(),
  deliveryNotes: z.string().optional().nullable(),
  paymentMethod: z.enum(['MTN_MOMO', 'AIRTEL_MONEY', 'CARD', 'CASH']).default('MTN_MOMO'),
  items: z.array(orderItemInputSchema).min(1, 'At least 1 item is required'),
});

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${randomNum}`;
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const validated = createOrderSchema.parse(req.body);

    // Fetch product details for accurate pricing and stock verification
    const productIds = validated.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      res.status(400).json({ success: false, message: 'One or more selected products are invalid or unavailable' });
      return;
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let calculatedTotal = 0;
    const orderItemsData = validated.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = product.price;
      calculatedTotal += unitPrice * item.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
      };
    });

    let orderNumber = generateOrderNumber();
    let exists = await prisma.order.findUnique({ where: { orderNumber } });
    while (exists) {
      orderNumber = generateOrderNumber();
      exists = await prisma.order.findUnique({ where: { orderNumber } });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber,
        clientName: validated.clientName,
        clientPhone: validated.clientPhone,
        clientEmail: validated.clientEmail,
        deliveryMethod: validated.deliveryMethod,
        deliveryAddress: validated.deliveryAddress || null,
        deliveryNotes: validated.deliveryNotes || null,
        totalAmount: calculatedTotal,
        currency: 'UGX',
        orderStatus: 'PENDING_PAYMENT',
        paymentStatus: 'PENDING',
        paymentMethod: validated.paymentMethod,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const itemsSummary = order.items
      .map((i) => `• ${i.quantity}x ${i.product.name} (UGX ${i.unitPrice.toLocaleString()})`)
      .join('\n');

    const whatsAppMessage = encodeURIComponent(
      `Hello Marvin Tattoos Atelier! I have placed an aftercare / shop order.\n\n*Order No:* ${orderNumber}\n*Client:* ${validated.clientName}\n*Phone:* ${validated.clientPhone}\n*Delivery:* ${validated.deliveryMethod}\n*Payment:* ${validated.paymentMethod}\n*Total:* UGX ${calculatedTotal.toLocaleString()}\n\n*Items:*\n${itemsSummary}`
    );
    const directWhatsAppUrl = `https://wa.me/256705748774?text=${whatsAppMessage}`;

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        ...order,
        directWhatsAppUrl,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    console.error('createOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
}

export async function getOrderByNumber(req: Request, res: Response): Promise<void> {
  try {
    const orderNumber = req.params.orderNumber as string;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: { product: true },
        },
        transactions: true,
      },
    });

    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found' });
      return;
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error('getOrderByNumber error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order' });
  }
}

export async function getAllOrders(req: Request, res: Response): Promise<void> {
  try {
    const { orderStatus, paymentStatus, search } = req.query;

    const whereClause: any = {};
    if (orderStatus && typeof orderStatus === 'string' && orderStatus !== 'ALL') {
      whereClause.orderStatus = orderStatus;
    }
    if (paymentStatus && typeof paymentStatus === 'string' && paymentStatus !== 'ALL') {
      whereClause.paymentStatus = paymentStatus;
    }
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { orderNumber: { contains: search } },
        { clientName: { contains: search } },
        { clientPhone: { contains: search } },
        { clientEmail: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: { product: true },
        },
        transactions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    console.error('getAllOrders error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders' });
  }
}

export async function updateOrder(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { orderStatus, paymentStatus, deliveryNotes } = req.body;

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(deliveryNotes !== undefined && { deliveryNotes }),
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('updateOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
}

export async function deleteOrder(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    await prisma.order.delete({ where: { id } });
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    console.error('deleteOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
}
