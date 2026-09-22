import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { upsertUserOnAction } from '../services/userService.js';
import { notifyTelegramNewOrder } from '../services/telegramService.js';
import { z } from 'zod';
import { getResolvedPaymentConfig } from '../services/paymentConfigService.js';

const orderItemInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
});

const createOrderSchema = z.object({
  clientName: z.string().min(2, 'Name must be at least 2 characters'),
  clientPhone: z.string().min(7, 'Phone must be at least 7 characters'),
  clientEmail: z.string().email('Invalid email address'),
  deliveryMethod: z.enum(['STUDIO_PICKUP', 'KAMPALA_DISPATCH']).default('STUDIO_PICKUP'),
  deliveryAddress: z.string().optional(),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(['MTN_MOMO', 'AIRTEL_MONEY', 'MOMO', 'MOBILE_MONEY', 'CARD', 'CASH']).default('MTN_MOMO'),
  items: z.array(orderItemInputSchema).min(1, 'At least 1 item is required'),
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

function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ORD-${year}-${randomNum}`;
}

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const validated = createOrderSchema.parse(req.body);

    const resolvedPaymentMethod: string =
      validated.paymentMethod === 'MOMO' || validated.paymentMethod === 'MOBILE_MONEY'
        ? detectUgandaCarrier(validated.clientPhone)
        : validated.paymentMethod;

    // Validate payment method configuration & toggles
    const config = await getResolvedPaymentConfig();
    const isMomo = resolvedPaymentMethod === 'MTN_MOMO' || resolvedPaymentMethod === 'AIRTEL_MONEY';
    const isCard = resolvedPaymentMethod === 'CARD';
    const isCash = resolvedPaymentMethod === 'CASH';

    if (isMomo) {
      if (!config.momoEnabled) {
        res.status(400).json({
          success: false,
          message: 'Mobile Money payments are currently disabled. Please choose another payment option.',
        });
        return;
      }
      if (!config.marzpay.isConfigured) {
        res.status(400).json({
          success: false,
          message: 'Mobile Money gateway is not configured yet. Please select Cash on Studio Pickup or contact us.',
        });
        return;
      }
    } else if (isCard) {
      if (!config.cardEnabled) {
        res.status(400).json({
          success: false,
          message: 'Card payments are currently disabled. Please choose Mobile Money or Cash on Pickup.',
        });
        return;
      }
      if (!config.marzpay.isConfigured) {
        res.status(400).json({
          success: false,
          message: 'Card payment gateway is not configured yet. Please select Mobile Money or Cash on Pickup.',
        });
        return;
      }
    } else if (isCash) {
      if (!config.cashEnabled) {
        res.status(400).json({
          success: false,
          message: 'Cash on Studio Pickup is currently disabled. Please choose another payment option.',
        });
        return;
      }
    }

    // Fetch all products to resolve items flexibly
    let allDbProducts = await prisma.product.findMany();

    if (allDbProducts.length === 0) {
      // Auto-create default seed product if table empty
      const defaultProd = await prisma.product.create({
        data: {
          name: 'Clinical Tattoo Aftercare Balm',
          category: 'Aftercare',
          price: 95000,
          currency: 'UGX',
          description: 'Cold-pressed calendula and shea butter sterile barrier.',
          imageUrl: 'https://images.unsplash.com/photo-1608248597359-24757c917fb2?auto=format&fit=crop&w=600&q=80',
          inStock: true,
          stockCount: 40,
          specs: JSON.stringify(['100ml Glass Bottle', 'Organic Calendula']),
        },
      });
      allDbProducts = [defaultProd];
    }

    const orderItemsData: Array<{ productId: string; quantity: number; unitPrice: number }> = [];
    let calculatedTotal = 0;

    for (const item of validated.items) {
      let product = allDbProducts.find((p) => p.id === item.productId);

      if (!product) {
        if (item.productId === 'prod-01' || item.productId.includes('1')) {
          product = allDbProducts.find((p) => p.name.includes('Rotary') || p.category === 'Hard Goods') || allDbProducts[0];
        } else if (item.productId === 'prod-02' || item.productId.includes('2')) {
          product = allDbProducts.find((p) => p.name.includes('Aftercare') || p.category === 'Aftercare') || allDbProducts[1] || allDbProducts[0];
        } else if (item.productId === 'prod-03' || item.productId.includes('3')) {
          product = allDbProducts.find((p) => p.name.includes('Needle') || p.category === 'Needles') || allDbProducts[2] || allDbProducts[0];
        } else if (item.productId === 'prod-04' || item.productId.includes('4')) {
          product = allDbProducts.find((p) => p.name.includes('Titanium') || p.category === 'Titanium Jewelry') || allDbProducts[3] || allDbProducts[0];
        } else {
          product = allDbProducts[0];
        }
      }

      const unitPrice = product.price;
      calculatedTotal += unitPrice * item.quantity;
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice,
      });
    }

    let orderNumber = generateOrderNumber();
    let exists = await prisma.order.findUnique({ where: { orderNumber } });
    while (exists) {
      orderNumber = generateOrderNumber();
      exists = await prisma.order.findUnique({ where: { orderNumber } });
    }

    // Auto-upsert Client / User record in database
    const user = await upsertUserOnAction({
      name: validated.clientName,
      phone: validated.clientPhone,
      email: validated.clientEmail,
      notes: validated.deliveryNotes,
    });

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
        paymentMethod: resolvedPaymentMethod,
        userPhone: user ? user.phone : null,
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

    // Send automated Telegram alert in background
    notifyTelegramNewOrder({
      orderNumber,
      clientName: validated.clientName,
      clientPhone: validated.clientPhone,
      totalAmount: calculatedTotal,
      deliveryMethod: validated.deliveryMethod,
      deliveryAddress: validated.deliveryAddress,
      paymentMethod: resolvedPaymentMethod,
      itemsText: itemsSummary,
    }).catch((err) => console.error('Order Telegram notification error:', err));

    const whatsAppMessage = encodeURIComponent(
      `Hello Marvin Tattoo Studio! I have placed an aftercare / shop order.\n\n*Order No:* ${orderNumber}\n*Client:* ${validated.clientName}\n*Phone:* ${validated.clientPhone}\n*Delivery:* ${validated.deliveryMethod}\n*Payment:* ${validated.paymentMethod}\n*Total:* UGX ${calculatedTotal.toLocaleString()}\n\n*Items:*\n${itemsSummary}`
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
