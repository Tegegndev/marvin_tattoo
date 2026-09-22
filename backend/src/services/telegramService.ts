import { prisma } from "../config/database.js";
import { env } from "../config/env.js";

export interface ResolvedTelegramConfig {
  enabled: boolean;
  botToken: string;
  chatId: string;
  notifyBookings: boolean;
  notifyOrders: boolean;
  notifyPayments: boolean;
  isConfigured: boolean;
  source: "db" | "env" | "missing";
}

export interface AdminTelegramConfig {
  enabled: boolean;
  hasBotToken: boolean;
  maskedBotToken: string;
  rawBotToken?: string;
  chatId: string;
  notifyBookings: boolean;
  notifyOrders: boolean;
  notifyPayments: boolean;
  isConfigured: boolean;
  source: "db" | "env" | "missing";
}

let cachedTelegramConfig: { config: ResolvedTelegramConfig; timestamp: number } | null = null;
const CACHE_TTL_MS = 5000; // 5 seconds in-memory cache

export function invalidateTelegramConfigCache(): void {
  cachedTelegramConfig = null;
}

/**
 * Helper to mask a Telegram Bot Token for safe display in the Admin UI
 * e.g. "7123456789:AAH..." -> "712345...9AAH"
 */
function maskToken(token: string): string {
  if (!token) return "";
  if (token.length <= 10) return "********";
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

/**
 * Returns the fully resolved Telegram configuration, prioritizing DB settings with fallback to .env
 */
export async function getResolvedTelegramConfig(): Promise<ResolvedTelegramConfig> {
  const now = Date.now();
  if (cachedTelegramConfig && now - cachedTelegramConfig.timestamp < CACHE_TTL_MS) {
    return cachedTelegramConfig.config;
  }

  const settings = await prisma.siteSetting.findUnique({
    where: { id: "studio_config" },
  });

  let botToken = "";
  let source: "db" | "env" | "missing" = "missing";

  if (settings?.telegramBotToken && settings.telegramBotToken.trim().length > 0) {
    botToken = settings.telegramBotToken.trim();
    source = "db";
  } else if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_BOT_TOKEN.trim().length > 0) {
    botToken = env.TELEGRAM_BOT_TOKEN.trim();
    source = "env";
  }

  let chatId = "";
  if (settings?.telegramChatId && settings.telegramChatId.trim().length > 0) {
    chatId = settings.telegramChatId.trim();
  } else if (env.TELEGRAM_CHAT_ID && env.TELEGRAM_CHAT_ID.trim().length > 0) {
    chatId = env.TELEGRAM_CHAT_ID.trim();
  }

  const enabled =
    settings?.telegramEnabled !== undefined
      ? settings.telegramEnabled
      : env.TELEGRAM_ENABLED;

  const notifyBookings = settings?.telegramNotifyBookings ?? true;
  const notifyOrders = settings?.telegramNotifyOrders ?? true;
  const notifyPayments = settings?.telegramNotifyPayments ?? true;

  const isConfigured = Boolean(botToken && chatId);

  const resolved: ResolvedTelegramConfig = {
    enabled,
    botToken,
    chatId,
    notifyBookings,
    notifyOrders,
    notifyPayments,
    isConfigured,
    source,
  };

  cachedTelegramConfig = { config: resolved, timestamp: now };
  return resolved;
}

/**
 * Returns a sanitized configuration suitable for displaying in the Admin settings panel
 */
export async function getAdminTelegramConfig(): Promise<AdminTelegramConfig> {
  const resolved = await getResolvedTelegramConfig();
  return {
    enabled: resolved.enabled,
    hasBotToken: Boolean(resolved.botToken),
    maskedBotToken: maskToken(resolved.botToken),
    rawBotToken: resolved.botToken, // returned to authenticated admin only
    chatId: resolved.chatId,
    notifyBookings: resolved.notifyBookings,
    notifyOrders: resolved.notifyOrders,
    notifyPayments: resolved.notifyPayments,
    isConfigured: resolved.isConfigured,
    source: resolved.source,
  };
}

/**
 * Dispatches a Telegram message to one or multiple chat IDs (supports comma-separated IDs)
 */
export async function sendTelegramMessage(
  text: string,
  options?: {
    botToken?: string;
    chatIds?: string | string[];
    parseMode?: "HTML" | "Markdown" | "MarkdownV2";
  }
): Promise<{ success: boolean; deliveredCount: number; errors?: string[] }> {
  try {
    const config = await getResolvedTelegramConfig();
    const token = options?.botToken || config.botToken;
    const targetChatIds = options?.chatIds || config.chatId;

    if (!token) {
      console.warn("⚠️ [Telegram Notification Skipped] No Bot Token configured.");
      return { success: false, deliveredCount: 0, errors: ["Missing Telegram Bot Token"] };
    }

    if (!targetChatIds) {
      console.warn("⚠️ [Telegram Notification Skipped] No Chat ID configured.");
      return { success: false, deliveredCount: 0, errors: ["Missing Telegram Chat ID"] };
    }

    // Parse one or comma-separated chat IDs
    const idList = (
      Array.isArray(targetChatIds)
        ? targetChatIds
        : targetChatIds.split(",")
    )
      .map((id) => id.trim())
      .filter((id) => id.length > 0);

    if (idList.length === 0) {
      return { success: false, deliveredCount: 0, errors: ["No valid Chat ID found"] };
    }

    const errors: string[] = [];
    let deliveredCount = 0;

    for (const chatId of idList) {
      try {
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: options?.parseMode || "HTML",
            disable_web_page_preview: true,
          }),
          signal: AbortSignal.timeout(8000),
        });

        const data: any = await res.json().catch(() => null);

        if (!res.ok || !data?.ok) {
          const errMsg = data?.description || `HTTP ${res.status} ${res.statusText}`;
          console.warn(`⚠️ [Telegram API Error to chat ${chatId}]:`, errMsg);
          errors.push(`Chat ${chatId}: ${errMsg}`);
        } else {
          deliveredCount++;
        }
      } catch (chatErr: any) {
        errors.push(`Chat ${chatId}: ${chatErr.message || "Network error"}`);
      }
    }

    return {
      success: deliveredCount > 0,
      deliveredCount,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (err: any) {
    console.error("sendTelegramMessage error:", err);
    return { success: false, deliveredCount: 0, errors: [err.message || "Internal error"] };
  }
}

/**
 * Tests connection with Telegram Bot API and optionally sends a verification test alert
 */
export async function testTelegramConnection(
  customBotToken?: string,
  customChatId?: string
): Promise<{
  success: boolean;
  botUsername?: string;
  botFirstName?: string;
  message: string;
  details?: any;
}> {
  const config = await getResolvedTelegramConfig();
  const token = customBotToken?.trim() || config.botToken;
  const chatId = customChatId?.trim() || config.chatId;

  if (!token) {
    return {
      success: false,
      message: "No Bot Token provided or configured. Enter your Telegram Bot Token from @BotFather first.",
    };
  }

  // 1. Verify Bot Token validity via getMe
  try {
    const meRes = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
      method: "GET",
      signal: AbortSignal.timeout(8000),
    });

    const meData: any = await meRes.json().catch(() => null);

    if (!meRes.ok || !meData?.ok || !meData?.result) {
      return {
        success: false,
        message: `Telegram authentication failed: ${meData?.description || "Invalid Bot Token"}`,
      };
    }

    const botUsername = meData.result.username;
    const botFirstName = meData.result.first_name;

    // 2. If Chat ID is provided, send a live test message
    if (chatId) {
      const nowStr = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });

      const testMsg = [
        `⚡ <b>MARVIN TATTOO STUDIO — TELEGRAM TEST ALERT</b>`,
        ``,
        `Your Telegram bot is successfully connected and authorized!`,
        `• <b>Bot:</b> @${botUsername} (${botFirstName})`,
        `• <b>Chat ID:</b> <code>${chatId}</code>`,
        `• <b>Timestamp:</b> ${nowStr}`,
        ``,
        `You will now receive instant push alerts whenever a client books a session or places an order in the shop.`,
      ].join("\n");

      const sendResult = await sendTelegramMessage(testMsg, {
        botToken: token,
        chatIds: chatId,
        parseMode: "HTML",
      });

      if (!sendResult.success) {
        return {
          success: false,
          botUsername,
          botFirstName,
          message: `Bot token is valid (@${botUsername}), but failed to deliver test message: ${
            sendResult.errors?.join(", ") || "Make sure you have clicked 'Start' in the chat with your bot first!"
          }`,
        };
      }

      return {
        success: true,
        botUsername,
        botFirstName,
        message: `Success! Connected to @${botUsername} and test alert delivered to chat ID (${chatId}).`,
      };
    }

    return {
      success: true,
      botUsername,
      botFirstName,
      message: `Bot token verified! Active as @${botUsername}. Provide a Chat ID to test message delivery.`,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to reach Telegram API: ${err.message || "Network error / timeout"}`,
    };
  }
}

/**
 * Format phone number clean for display & clickable wa.me link
 */
function cleanPhoneForLink(phone: string): string {
  let cleaned = (phone || "").replace(/[^\d]/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "256" + cleaned.substring(1);
  }
  return cleaned;
}

/**
 * 1. Admin Alert: Notify on Telegram when a new booking is created
 */
export async function notifyTelegramNewBooking(booking: {
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
}): Promise<void> {
  try {
    const config = await getResolvedTelegramConfig();
    if (!config.enabled || !config.notifyBookings || !config.isConfigured) {
      return;
    }

    const formattedDate = new Date(booking.preferredDate).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const cleanPhone = cleanPhoneForLink(booking.clientPhone);
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : "";

    const msg = [
      `🚨 <b>NEW STUDIO BOOKING INTAKE</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🔖 <b>Reference:</b> <code>${booking.referenceCode}</code>`,
      `👤 <b>Client:</b> ${booking.clientName}`,
      `📞 <b>Phone:</b> <a href="${waLink}">${booking.clientPhone}</a>`,
      booking.clientEmail ? `📧 <b>Email:</b> ${booking.clientEmail}` : null,
      `🎨 <b>Discipline:</b> ${booking.serviceType.replace(/_/g, " ").toUpperCase()}`,
      `📍 <b>Placement:</b> ${booking.placement}`,
      `📐 <b>Size:</b> ${booking.size}`,
      `🗓️ <b>Preferred Date:</b> ${formattedDate} (${booking.timeSlot.toUpperCase()})`,
      booking.notes ? `📝 <b>Client Notes:</b> ${booking.notes}` : null,
      ``,
      `👉 <a href="${env.CLIENT_URL}/admin">Open Marvin Admin CRM</a>`,
    ]
      .filter(Boolean)
      .join("\n");

    await sendTelegramMessage(msg, { parseMode: "HTML" });
  } catch (err) {
    console.error("notifyTelegramNewBooking error:", err);
  }
}

/**
 * 2. Admin Alert: Notify on Telegram when a new shop order is placed
 */
export async function notifyTelegramNewOrder(order: {
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  totalAmount: number;
  deliveryMethod: string;
  deliveryAddress?: string | null;
  paymentMethod: string;
  itemsText?: string;
}): Promise<void> {
  try {
    const config = await getResolvedTelegramConfig();
    if (!config.enabled || !config.notifyOrders || !config.isConfigured) {
      return;
    }

    const cleanPhone = cleanPhoneForLink(order.clientPhone);
    const waLink = cleanPhone ? `https://wa.me/${cleanPhone}` : "";

    const msg = [
      `🛍️ <b>NEW SHOP ORDER PLACED</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 <b>Order Number:</b> <code>${order.orderNumber}</code>`,
      `👤 <b>Customer:</b> ${order.clientName}`,
      `📞 <b>Phone:</b> <a href="${waLink}">${order.clientPhone}</a>`,
      `💵 <b>Total Amount:</b> <b>UGX ${order.totalAmount.toLocaleString()}</b>`,
      `💳 <b>Payment Method:</b> ${order.paymentMethod}`,
      `🚚 <b>Delivery:</b> ${order.deliveryMethod.replace(/_/g, " ")}${
        order.deliveryAddress ? ` (${order.deliveryAddress})` : ""
      }`,
      order.itemsText ? `\n🛒 <b>Items:</b>\n${order.itemsText}` : null,
      ``,
      `👉 <a href="${env.CLIENT_URL}/admin">View Order in Admin Dashboard</a>`,
    ]
      .filter(Boolean)
      .join("\n");

    await sendTelegramMessage(msg, { parseMode: "HTML" });
  } catch (err) {
    console.error("notifyTelegramNewOrder error:", err);
  }
}

/**
 * 3. Admin Alert: Notify on Telegram when a payment transaction is confirmed / verified
 */
export async function notifyTelegramPaymentSuccess(payment: {
  orderNumber: string;
  amount: number;
  paymentMethod: string;
  customerPhone?: string | null;
  gatewayRef?: string | null;
  merchantTxRef?: string;
}): Promise<void> {
  try {
    const config = await getResolvedTelegramConfig();
    if (!config.enabled || !config.notifyPayments || !config.isConfigured) {
      return;
    }

    const msg = [
      `💰 <b>PAYMENT CONFIRMED — SUCCESS</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 <b>Order Number:</b> <code>${payment.orderNumber}</code>`,
      `💵 <b>Amount Received:</b> <b>UGX ${payment.amount.toLocaleString()}</b>`,
      `💳 <b>Method:</b> ${payment.paymentMethod}`,
      payment.customerPhone ? `📱 <b>Phone:</b> ${payment.customerPhone}` : null,
      payment.gatewayRef ? `🔗 <b>Gateway Ref:</b> <code>${payment.gatewayRef}</code>` : null,
      payment.merchantTxRef ? `🧾 <b>Tracking Ref:</b> <code>${payment.merchantTxRef}</code>` : null,
      `🕒 <b>Time:</b> ${new Date().toLocaleTimeString("en-GB")}`,
      ``,
      `👉 <a href="${env.CLIENT_URL}/admin">View in Admin Panel</a>`,
    ]
      .filter(Boolean)
      .join("\n");

    await sendTelegramMessage(msg, { parseMode: "HTML" });
  } catch (err) {
    console.error("notifyTelegramPaymentSuccess error:", err);
  }
}
