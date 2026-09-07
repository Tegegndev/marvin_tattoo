import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    name: string;
  };
}

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ success: false, message: "Authentication required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      email: string;
      name: string;
    };
    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
