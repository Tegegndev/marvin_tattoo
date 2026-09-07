import { Router } from "express";
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

export const serviceRouter = Router();

serviceRouter.get("/", getServices);
serviceRouter.get("/:id", getService);
serviceRouter.post("/", requireAdmin, upload.single("image"), createService);
serviceRouter.put("/:id", requireAdmin, upload.single("image"), updateService);
serviceRouter.delete("/:id", requireAdmin, deleteService);
