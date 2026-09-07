import { Router } from "express";
import {
  getTestimonials,
  createTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { requireAdmin } from "../middleware/auth.js";

export const testimonialRouter = Router();

testimonialRouter.get("/", getTestimonials);
testimonialRouter.post("/", requireAdmin, createTestimonial);
testimonialRouter.delete("/:id", requireAdmin, deleteTestimonial);
