import { Router } from "express";
import {
  createBooking,
  getBookingByRef,
  getAllBookings,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";
import { requireAdmin } from "../middleware/auth.js";
import { upload } from "../config/multer.js";

export const bookingRouter = Router();

// Public routes
bookingRouter.post("/", upload.single("referenceImage"), createBooking);
bookingRouter.get("/ref/:referenceCode", getBookingByRef);

// Admin-only CRM routes
bookingRouter.get("/", requireAdmin, getAllBookings);
bookingRouter.put("/:id", requireAdmin, updateBooking);
bookingRouter.delete("/:id", requireAdmin, deleteBooking);
