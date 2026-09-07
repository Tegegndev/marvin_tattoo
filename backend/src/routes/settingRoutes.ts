import { Router } from "express";
import {
  getSettings,
  updateSettings,
  updateHeroImage,
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
