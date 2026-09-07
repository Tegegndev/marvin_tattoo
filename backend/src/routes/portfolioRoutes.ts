import { Router } from "express";
import {
  getPortfolio,
  getPortfolioPiece,
  createPortfolioPiece,
  updatePortfolioPiece,
  deletePortfolioPiece,
} from "../controllers/portfolioController.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

export const portfolioRouter = Router();

// Public routes
portfolioRouter.get("/", getPortfolio);
portfolioRouter.get("/:id", getPortfolioPiece);

// Admin-only routes
portfolioRouter.post("/", requireAdmin, upload.single("image"), createPortfolioPiece);
portfolioRouter.put("/:id", requireAdmin, upload.single("image"), updatePortfolioPiece);
portfolioRouter.delete("/:id", requireAdmin, deletePortfolioPiece);
