import { Router } from "express";
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/memberController.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

export const memberRouter = Router();

memberRouter.get("/", getMembers);
memberRouter.get("/:id", getMember);
memberRouter.post("/", requireAdmin, upload.single("avatar"), createMember);
memberRouter.put("/:id", requireAdmin, upload.single("avatar"), updateMember);
memberRouter.delete("/:id", requireAdmin, deleteMember);
