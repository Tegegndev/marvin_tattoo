import { Router } from "express";
import { login, logout, me, changePassword, loginSchema, changePasswordSchema } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/auth.js";
import { validateRequest } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";

export const authRouter = Router();

authRouter.post("/login", authLimiter, validateRequest(loginSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAdmin, me);
authRouter.post("/change-password", requireAdmin, validateRequest(changePasswordSchema), changePassword);

