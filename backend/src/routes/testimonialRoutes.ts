import { Router } from "express";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { requireAdmin } from "../middleware/auth.js";

export const testimonialRouter = Router();

testimonialRouter.get("/", getTestimonials);
testimonialRouter.post("/", requireAdmin, createTestimonial);
testimonialRouter.put("/:id", requireAdmin, updateTestimonial);
testimonialRouter.delete("/:id", requireAdmin, deleteTestimonial);

