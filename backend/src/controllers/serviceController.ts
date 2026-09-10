import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { processAndSaveImage, deleteLocalImage } from "../services/imageService.js";

const formatService = (s: any) => ({
  ...s,
  specs: typeof s.specs === "string" ? JSON.parse(s.specs || "[]") : s.specs || [],
  processSteps: typeof s.processSteps === "string" ? JSON.parse(s.processSteps || "[]") : s.processSteps || [],
  pricingTiers: typeof s.pricingTiers === "string" ? JSON.parse(s.pricingTiers || "[]") : s.pricingTiers || [],
  faqs: typeof s.faqs === "string" ? JSON.parse(s.faqs || "[]") : s.faqs || [],
  prepGuidelines: typeof s.prepGuidelines === "string" ? JSON.parse(s.prepGuidelines || "[]") : s.prepGuidelines || [],
  aftercareGuidelines: typeof s.aftercareGuidelines === "string" ? JSON.parse(s.aftercareGuidelines || "[]") : s.aftercareGuidelines || [],
  galleryImages: typeof s.galleryImages === "string" ? JSON.parse(s.galleryImages || "[]") : s.galleryImages || [],
});

export const getServices = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });

    res.json({
      success: true,
      count: services.length,
      data: services.map(formatService),
    });
  } catch (error) {
    next(error);
  }
};

export const getService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      res.status(404).json({ success: false, message: "Service discipline not found" });
      return;
    }

    res.json({
      success: true,
      data: formatService(service),
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { disciplineNumber, title, subtitle, description, category, iconName, specs, sortOrder } = req.body;

    if (!title || !description || !disciplineNumber) {
      res.status(400).json({
        success: false,
        message: "Title, disciplineNumber, and description are required.",
      });
      return;
    }

    let imageUrl = req.body.imageUrl || "";
    if (req.file) {
      imageUrl = await processAndSaveImage(req.file, "service");
    }

    const created = await prisma.service.create({
      data: {
        disciplineNumber,
        title,
        subtitle: subtitle || "",
        description,
        category: category || "TATTOO",
        imageUrl: imageUrl || "/images/portfolio/portrait-elder-woman.png",
        iconName: iconName || "skull",
        specs: typeof specs === "object" ? JSON.stringify(specs) : specs || "[]",
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Service discipline created successfully",
      data: {
        ...created,
        specs: JSON.parse(created.specs),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.service.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ success: false, message: "Service not found" });
      return;
    }

    let imageUrl = existing.imageUrl;
    if (req.file) {
      deleteLocalImage(existing.imageUrl);
      imageUrl = await processAndSaveImage(req.file, "service");
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const { disciplineNumber, title, subtitle, description, category, iconName, specs, sortOrder } = req.body;

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(disciplineNumber && { disciplineNumber }),
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description && { description }),
        ...(category && { category }),
        ...(imageUrl && { imageUrl }),
        ...(iconName && { iconName }),
        ...(specs !== undefined && {
          specs: typeof specs === "object" ? JSON.stringify(specs) : specs,
        }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder, 10) }),
      },
    });

    res.json({
      success: true,
      message: "Service updated successfully",
      data: {
        ...updated,
        specs: JSON.parse(updated.specs),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.service.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ success: false, message: "Service not found" });
      return;
    }

    deleteLocalImage(existing.imageUrl);
    await prisma.service.delete({ where: { id } });

    res.json({ success: true, message: "Service discipline deleted" });
  } catch (error) {
    next(error);
  }
};
