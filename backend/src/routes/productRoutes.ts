import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  renameProductCategory,
  deleteProductCategory,
} from "../controllers/productController.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

export const productRouter = Router();

// Public routes
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);

// Admin-only routes
productRouter.put("/categories/rename", requireAdmin, renameProductCategory);
productRouter.post("/categories/delete", requireAdmin, deleteProductCategory);
productRouter.post("/", requireAdmin, upload.single("image"), createProduct);
productRouter.put("/:id", requireAdmin, upload.single("image"), updateProduct);
productRouter.delete("/:id", requireAdmin, deleteProduct);

