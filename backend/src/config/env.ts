import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5050,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  JWT_SECRET: process.env.JWT_SECRET || "marvin_atelier_super_secret_jwt_key_change_in_production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  FLW_PUBLIC_KEY: process.env.FLW_PUBLIC_KEY || "",
  FLW_SECRET_KEY: process.env.FLW_SECRET_KEY || "",
  FLW_SECRET_HASH: process.env.FLW_SECRET_HASH || "marvin_flw_webhook_secret_hash",
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || "",
  STUDIO_WHATSAPP: process.env.STUDIO_WHATSAPP || "+256705748774",
  ADMIN_NOTIFICATION_PHONE: process.env.ADMIN_NOTIFICATION_PHONE || "256705748774",
  IMAGE_BUCKET_URL: process.env.IMAGE_BUCKET_URL || "https://images.marvintattoos256.com",
  IMAGE_BUCKET_API_KEY: process.env.IMAGE_BUCKET_API_KEY || "",
  MARZPAY_API_BASE: process.env.MARZPAY_API_BASE || "https://wallet.wearemarz.com/api/v1",
  MARZPAY_API_KEY: process.env.MARZPAY_API_KEY || "",
  MARZPAY_API_SECRET: process.env.MARZPAY_API_SECRET || "",
  MARZPAY_WEBHOOK_SECRET: process.env.MARZPAY_WEBHOOK_SECRET || "",
  MARZPAY_CALLBACK_URL: process.env.MARZPAY_CALLBACK_URL || "",
  MARZPAY_MODE: process.env.MARZPAY_MODE || "live",
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "",
  TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID || "",
  TELEGRAM_ENABLED: process.env.TELEGRAM_ENABLED === "true",
};

