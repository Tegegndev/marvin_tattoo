import { Router } from "express";
import { authRouter } from "./authRoutes.js";
import { portfolioRouter } from "./portfolioRoutes.js";
import { serviceRouter } from "./serviceRoutes.js";
import { testimonialRouter } from "./testimonialRoutes.js";
import { settingRouter } from "./settingRoutes.js";

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
router.use("/portfolio", portfolioRouter);
router.use("/services", serviceRouter);
router.use("/testimonials", testimonialRouter);
router.use("/settings", settingRouter);
