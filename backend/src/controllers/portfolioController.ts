import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { processAndSaveImage, deleteLocalImage } from "../services/imageService.js";

export const getPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, featured } = req.query;

    const whereClause: any = {};
    if (category && typeof category === "string" && category !== "all") {
      whereClause.category = category;
    }
    if (featured === "true") {
      whereClause.featured = true;
    }

    const pieces = await prisma.portfolioPiece.findMany({
      where: whereClause,
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });

    res.json({
      success: true,
      count: pieces.length,
      data: pieces,
    });
  } catch (error) {
    next(error);
  }
};

export const getPortfolioPiece = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const piece = await prisma.portfolioPiece.findUnique({
      where: { id },
    });

    if (!piece) {
      res.status(404).json({ success: false, message: "Portfolio piece not found" });
      return;
    }

    res.json({ success: true, data: piece });
  } catch (error) {
    next(error);
  }
};

export const createPortfolioPiece = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      category,
      categoryLabel,
      zone,
      flashId,
      description,
      duration,
      pigment,
      featured,
      sortOrder,
    } = req.body;

    if (!title || !category || !description) {
      res.status(400).json({
        success: false,
        message: "Title, category, and description are required.",
      });
      return;
    }

    let imageUrl = req.body.imageUrl || "";
    if (req.file) {
      imageUrl = await processAndSaveImage(req.file, "portfolio");
    }

    if (!imageUrl) {
      res.status(400).json({
        success: false,
        message: "An image file or imageUrl is required for portfolio pieces.",
      });
      return;
    }

    const newPiece = await prisma.portfolioPiece.create({
      data: {
        title,
        category,
        categoryLabel: categoryLabel || category,
        zone: zone || "General",
        flashId: flashId || null,
        imageUrl,
        description,
        duration: duration || null,
        pigment: pigment || "Dynamic Triple Black",
        featured: featured === "true" || featured === true,
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Portfolio piece created successfully",
      data: newPiece,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePortfolioPiece = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const existing = await prisma.portfolioPiece.findUnique({ where: { id } });

    if (!existing) {
      res.status(404).json({ success: false, message: "Portfolio piece not found" });
      return;
    }

    let imageUrl = existing.imageUrl;
    if (req.file) {
      // Delete old local image if replaced
      deleteLocalImage(existing.imageUrl);
      imageUrl = await processAndSaveImage(req.file, "portfolio");
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const {
      title,
      category,
      categoryLabel,
      zone,
      flashId,
      description,
      duration,
      pigment,
      featured,
      sortOrder,
    } = req.body;

    const updated = await prisma.portfolioPiece.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(category && { category }),
        ...(categoryLabel && { categoryLabel }),
        ...(zone && { zone }),
        ...(flashId !== undefined && { flashId }),
        ...(imageUrl && { imageUrl }),
        ...(description && { description }),
        ...(duration !== undefined && { duration }),
        ...(pigment !== undefined && { pigment }),
        ...(featured !== undefined && {
          featured: featured === "true" || featured === true,
        }),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder, 10) }),
      },
    });

    res.json({
      success: true,
      message: "Portfolio piece updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePortfolioPiece = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const piece = await prisma.portfolioPiece.findUnique({ where: { id } });

    if (!piece) {
      res.status(404).json({ success: false, message: "Portfolio piece not found" });
      return;
    }

    deleteLocalImage(piece.imageUrl);
    await prisma.portfolioPiece.delete({ where: { id } });

    res.json({
      success: true,
      message: "Portfolio piece deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
