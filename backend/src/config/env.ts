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
  META_WHATSAPP_TOKEN: process.env.META_WHATSAPP_TOKEN || "",
  META_WHATSAPP_PHONE_NUMBER_ID: process.env.META_WHATSAPP_PHONE_NUMBER_ID || "",
  META_WHATSAPP_API_VERSION: process.env.META_WHATSAPP_API_VERSION || "v21.0",
  IMAGE_BUCKET_URL: process.env.IMAGE_BUCKET_URL || "https://images.tegegn.com.et",
  IMAGE_BUCKET_API_KEY: process.env.IMAGE_BUCKET_API_KEY || "",
};
