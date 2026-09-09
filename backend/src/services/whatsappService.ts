import { env } from '../config/env.js';

/**
 * Normalizes phone number into Meta WhatsApp Cloud API format (digits only, e.g. 256705748774)
 */
export function formatMetaPhoneNumber(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.trim().replace(/[\s\+\-()]/g, '');
  
  // Convert local Ugandan 07... into international 2567...
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '256' + cleaned.substring(1);
  }
  
  return cleaned;
}

export interface SendWhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Sends a WhatsApp message using Meta WhatsApp Cloud API.
 * Gracefully falls back to console logger if credentials are not configured yet.
 */
export async function sendWhatsAppMessage(
  recipientPhone: string,
  messageText: string
): Promise<SendWhatsAppResult> {
  const cleanPhone = formatMetaPhoneNumber(recipientPhone);
  if (!cleanPhone) {
    return { success: false, error: 'Invalid recipient phone number' };
  }

  const token = env.META_WHATSAPP_TOKEN;
  const phoneNumberId = env.META_WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = env.META_WHATSAPP_API_VERSION || 'v21.0';

  // If Meta API credentials are not yet configured in .env, log cleanly and return
  if (!token || !phoneNumberId || token.includes('your_') || phoneNumberId.includes('your_')) {
    console.log(`\n📱 [META WHATSAPP MOCK / PENDING CONFIG] To: +${cleanPhone}`);
    console.log(`--------------------------------------------------\n${messageText}\n--------------------------------------------------\n`);
    return {
      success: true,
      messageId: `mock_${Date.now()}`,
    };
  }

  try {
    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: {
        preview_url: false,
        body: messageText,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.error('Meta WhatsApp Cloud API Error:', data);
      return {
        success: false,
        error: data?.error?.message || 'Meta API returned error',
      };
    }

    const messageId = data?.messages?.[0]?.id;
    console.log(`⚡ [META WHATSAPP SENT] Message ID: ${messageId} to +${cleanPhone}`);
    return { success: true, messageId };
  } catch (error: any) {
    console.error('sendWhatsAppMessage network error:', error);
    return { success: false, error: error.message || 'Network request failed' };
  }
}

/**
 * 1. Admin Alert: Notify Marvin on WhatsApp when a new booking is submitted
 */
export async function notifyAdminNewBooking(booking: {
  referenceCode: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceType: string;
  placement: string;
  size: string;
  preferredDate: Date | string;
  timeSlot: string;
  notes?: string | null;
}) {
  const adminPhone = env.ADMIN_NOTIFICATION_PHONE || env.STUDIO_WHATSAPP;
  const formattedDate = new Date(booking.preferredDate).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const message = [
    `🚨 *NEW STUDIO BOOKING INTAKE*`,
    ``,
    `*Ref Code:* ${booking.referenceCode}`,
    `*Client:* ${booking.clientName}`,
    `*Phone:* ${booking.clientPhone}`,
    booking.clientEmail ? `*Email:* ${booking.clientEmail}` : null,
    `*Service:* ${booking.serviceType.replace(/_/g, ' ').toUpperCase()}`,
    `*Placement:* ${booking.placement}`,
    `*Size:* ${booking.size}`,
    `*Date:* ${formattedDate} (${booking.timeSlot.toUpperCase()})`,
    booking.notes ? `*Client Notes:* ${booking.notes}` : null,
    ``,
    `👉 View in Admin CRM: ${env.CLIENT_URL}/admin`,
  ]
    .filter(Boolean)
    .join('\n');

  return sendWhatsAppMessage(adminPhone, message);
}

/**
 * 2. Customer Confirmation: Send booking receipt to customer on WhatsApp
 */
export async function notifyCustomerBookingReceived(booking: {
  referenceCode: string;
  clientName: string;
  clientPhone: string;
  serviceType: string;
  placement: string;
  preferredDate: Date | string;
  timeSlot: string;
}) {
  const formattedDate = new Date(booking.preferredDate).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const message = [
    `✨ *MARVIN TATTOOS & PIERCING ATELIER*`,
    ``,
    `Hello *${booking.clientName}*,`,
    `We have received your booking request!`,
    ``,
    `*Booking Ref:* ${booking.referenceCode}`,
    `*Service:* ${booking.serviceType.replace(/_/g, ' ').toUpperCase()}`,
    `*Placement:* ${booking.placement}`,
    `*Preferred Date:* ${formattedDate} (${booking.timeSlot})`,
    ``,
    `Our master artist will review your intake details and message you here to confirm.`,
    ``,
    `📍 *Studio:* Level 5, New Pioneer Mall, Burton St, Kampala`,
    `📞 *Direct Line:* +256 705 748 774`,
  ].join('\n');

  return sendWhatsAppMessage(booking.clientPhone, message);
}

/**
 * 3. Admin Alert: Notify Marvin on WhatsApp when a new shop order is placed
 */
export async function notifyAdminNewOrder(order: {
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  totalAmount: number;
  deliveryMethod: string;
  deliveryAddress?: string | null;
  paymentMethod: string;
  itemsText?: string;
}) {
  const adminPhone = env.ADMIN_NOTIFICATION_PHONE || env.STUDIO_WHATSAPP;

  const message = [
    `🛍️ *NEW SHOP ORDER PLACED*`,
    ``,
    `*Order No:* ${order.orderNumber}`,
    `*Client:* ${order.clientName}`,
    `*Phone:* ${order.clientPhone}`,
    `*Total:* UGX ${order.totalAmount.toLocaleString()}`,
    `*Payment:* ${order.paymentMethod}`,
    `*Delivery:* ${order.deliveryMethod.replace(/_/g, ' ')}${order.deliveryAddress ? ` (${order.deliveryAddress})` : ''}`,
    order.itemsText ? `\n*Items Ordered:*\n${order.itemsText}` : null,
    ``,
    `👉 View in Admin Dashboard: ${env.CLIENT_URL}/admin`,
  ]
    .filter(Boolean)
    .join('\n');

  return sendWhatsAppMessage(adminPhone, message);
}

/**
 * 4. Customer Confirmation: Send shop order receipt to customer on WhatsApp
 */
export async function notifyCustomerOrderReceived(order: {
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  totalAmount: number;
  deliveryMethod: string;
  itemsText?: string;
}) {
  const message = [
    `🛍️ *MARVIN TATTOOS ATELIER — ORDER RECEIPT*`,
    ``,
    `Hello *${order.clientName}*,`,
    `Thank you for shopping with Marvin Tattoos Atelier!`,
    ``,
    `*Order Number:* ${order.orderNumber}`,
    `*Total:* UGX ${order.totalAmount.toLocaleString()}`,
    `*Delivery Method:* ${order.deliveryMethod.replace(/_/g, ' ')}`,
    order.itemsText ? `\n*Items:*\n${order.itemsText}` : null,
    ``,
    `Our dispatch team is preparing your package. If you need any assistance, reply directly to this chat.`,
    ``,
    `📍 *Studio Pickup:* Level 5, New Pioneer Mall, Burton St, Kampala`,
  ]
    .filter(Boolean)
    .join('\n');

  return sendWhatsAppMessage(order.clientPhone, message);
}
