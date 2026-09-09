import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  syncLegacyClients,
} from "../controllers/userController.js";
import { requireAdmin } from "../middleware/auth.js";

export const userRouter = Router();

// Admin-only Users CRM routes
userRouter.get("/", requireAdmin, getAllUsers);
userRouter.post("/sync-legacy", requireAdmin, syncLegacyClients);
userRouter.get("/:id", requireAdmin, getUserById);
userRouter.put("/:id", requireAdmin, updateUser);
userRouter.delete("/:id", requireAdmin, deleteUser);
