import { Router } from "express";
import {
  getSettings,
  updateSettings,
  updateHeroImage,
  updateHeroPortrait,
  updateLogo,
  updateOgImage,
  getPaymentConfig,
  updatePaymentConfig,
  testPaymentConnection,
  getTelegramConfig,
  updateTelegramConfig,
  testTelegramConnectionHandler,
} from "../controllers/settingController.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

export const settingRouter = Router();

settingRouter.get("/", getSettings);
settingRouter.put("/", requireAdmin, updateSettings);

// Payment Gateways & API Keys Management
settingRouter.get("/payment-config", requireAdmin, getPaymentConfig);
settingRouter.put("/payment-config", requireAdmin, updatePaymentConfig);
settingRouter.post("/payment-config/test", requireAdmin, testPaymentConnection);

// Telegram Bot Notifications Management
settingRouter.get("/telegram-config", requireAdmin, getTelegramConfig);
settingRouter.put("/telegram-config", requireAdmin, updateTelegramConfig);
settingRouter.post("/telegram-config/test", requireAdmin, testTelegramConnectionHandler);
settingRouter.post(
  "/hero-image",
  requireAdmin,
  upload.single("heroImage"),
  updateHeroImage
);
settingRouter.post(
  "/hero-portrait",
  requireAdmin,
  upload.single("heroPortrait"),
  updateHeroPortrait
);
settingRouter.post(
  "/logo",
  requireAdmin,
  upload.single("logo"),
  updateLogo
);
settingRouter.post(
  "/og-image",
  requireAdmin,
  upload.single("ogImage"),
  updateOgImage
);
