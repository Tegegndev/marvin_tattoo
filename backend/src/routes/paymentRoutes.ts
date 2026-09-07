import { Router } from "express";
import {
  initializePayment,
  verifyPayment,
  handleWebhook,
} from "../controllers/paymentController.js";

export const paymentRouter = Router();

// Public checkout & verification endpoints
paymentRouter.post("/initialize", initializePayment);
paymentRouter.get("/verify/:txRef", verifyPayment);

// Webhook endpoint (Flutterwave / MTN / Airtel)
paymentRouter.post("/webhook", handleWebhook);
