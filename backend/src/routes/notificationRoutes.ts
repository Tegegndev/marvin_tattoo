import { Router } from 'express';
import { requireAdmin } from '../middleware/auth.js';
import { sendWhatsAppMessage } from '../services/whatsappService.js';
import { env } from '../config/env.js';

export const notificationRouter = Router();

notificationRouter.post('/test-whatsapp', requireAdmin, async (req, res) => {
  try {
    const { phone, message } = req.body;
    const targetPhone = phone || env.ADMIN_NOTIFICATION_PHONE || env.STUDIO_WHATSAPP;
    const testText =
      message ||
      `⚡ *MARVIN TATTOOS ATELIER — TEST ALERT*\n\nYour Meta WhatsApp Cloud API is successfully configured and connected!\nYou will receive instant alerts whenever someone books or buys in the shop.\n\nTime: ${new Date().toLocaleTimeString()}`;

    const result = await sendWhatsAppMessage(targetPhone, testText);

    if (result.success) {
      res.json({
        success: true,
        message: `Test alert dispatched to +${targetPhone}`,
        data: result,
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to dispatch WhatsApp message',
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Internal notification error',
    });
  }
});
