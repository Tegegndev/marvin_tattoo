import { Router } from "express";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "online",
    service: "Marvin Tattoos Atelier API",
    timestamp: new Date().toISOString(),
  });
});
