import { Router } from "express";
import {
  getSettings,
  updateSettings,
  updateHeroImage,
  updateHeroPortrait,
  updateLogo,
  updateOgImage,
} from "../controllers/settingController.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

export const settingRouter = Router();

settingRouter.get("/", getSettings);
settingRouter.put("/", requireAdmin, updateSettings);
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
