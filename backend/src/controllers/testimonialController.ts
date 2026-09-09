import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";

export const getTestimonials = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, role, stars, quote, isGoogleVerified, approved } = req.body;

    if (!name || !quote) {
      res.status(400).json({ success: false, message: "Name and quote are required" });
      return;
    }

    const review = await prisma.testimonial.create({
      data: {
        name,
        role: role || "Verified Client",
        stars: stars ? parseInt(stars, 10) : 5,
        quote,
        isGoogleVerified: isGoogleVerified !== undefined ? isGoogleVerified : true,
        approved: approved !== undefined ? approved : true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: "Testimonial not found" });
      return;
    }

    const { name, role, stars, quote, isGoogleVerified, approved } = req.body;

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(role !== undefined && { role }),
        ...(stars !== undefined && { stars: Math.min(5, Math.max(1, parseInt(stars, 10))) }),
        ...(quote && { quote }),
        ...(isGoogleVerified !== undefined && {
          isGoogleVerified: isGoogleVerified === true || isGoogleVerified === "true",
        }),
        ...(approved !== undefined && {
          approved: approved === true || approved === "true",
        }),
      },
    });

    res.json({
      success: true,
      message: "Testimonial updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.testimonial.delete({ where: { id } });
    res.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    next(error);
  }
};

