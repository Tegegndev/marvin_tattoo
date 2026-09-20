import { Router } from "express";
import {
  initializePayment,
  verifyPayment,
  getPaymentMethods,
  handleWebhook,
  handleMarzPayWebhook,
} from "../controllers/paymentController.js";

export const paymentRouter = Router();

// Public checkout & verification endpoints
paymentRouter.get("/methods", getPaymentMethods);
paymentRouter.post("/initialize", initializePayment);
paymentRouter.get("/verify/:txRef", verifyPayment);

// Webhook endpoints
paymentRouter.post("/webhook", handleWebhook);
paymentRouter.post("/marzpay/webhook", handleMarzPayWebhook);
