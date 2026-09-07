import { Router } from "express";
import { authRouter } from "./authRoutes.js";

export const router = Router();

// Health Check
router.get("/health", (_req, res) => {
  res.json({
    status: "online",
    service: "Marvin Tattoos Atelier API",
    timestamp: new Date().toISOString(),
  });
});

// Mount Sub-routers
router.use("/auth", authRouter);
