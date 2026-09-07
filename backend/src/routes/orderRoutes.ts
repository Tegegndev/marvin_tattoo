import { Router } from "express";
import {
  createOrder,
  getOrderByNumber,
  getAllOrders,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import { requireAdmin } from "../middleware/auth.js";

export const orderRouter = Router();

// Public routes
orderRouter.post("/", createOrder);
orderRouter.get("/track/:orderNumber", getOrderByNumber);

// Admin-only routes
orderRouter.get("/", requireAdmin, getAllOrders);
orderRouter.put("/:id", requireAdmin, updateOrder);
orderRouter.delete("/:id", requireAdmin, deleteOrder);
