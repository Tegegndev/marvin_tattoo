import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { processAndSaveImage, deleteLocalImage } from "../services/imageService.js";

export const getPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, serviceId, featured } = req.query;

    const whereClause: any = {};
    if (category && typeof category === "string" && category !== "all") {
      whereClause.category = category;
    }
    if (serviceId && typeof serviceId === "string" && serviceId !== "all") {
      whereClause.serviceId = serviceId;
    }
    if (featured === "true") {
      whereClause.featured = true;
    }

    const pieces = await prisma.portfolioPiece.findMany({
      where: whereClause,
      include: {
        service: {
          select: {
            id: true,
            title: true,
            disciplineNumber: true,
            category: true,
          },
        },
      },
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
      include: {
        service: {
          select: {
            id: true,
            title: true,
            disciplineNumber: true,
            category: true,
          },
        },
      },
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
      serviceId,
      category,
      categoryLabel,
      artist,
      healingState,
      cycle,
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
        serviceId: serviceId || null,
        category,
        categoryLabel: categoryLabel || category,
        artist: artist || "Marvin",
        healingState: healingState || "Healed Masterpiece",
        cycle: cycle || "healed",
        zone: zone || "General",
        flashId: flashId || null,
        imageUrl,
        description,
        duration: duration || null,
        pigment: pigment || "Dynamic Triple Black",
        featured: featured === "true" || featured === true,
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            disciplineNumber: true,
            category: true,
          },
        },
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
    let existing = await prisma.portfolioPiece.findUnique({ where: { id } });

    if (!existing && req.body.flashId) {
      existing = await prisma.portfolioPiece.findFirst({
        where: { flashId: req.body.flashId },
      });
    }

    if (!existing && req.body.title) {
      existing = await prisma.portfolioPiece.findFirst({
        where: { title: req.body.title },
      });
    }

    if (!existing) {
      // If piece is not yet in database (e.g. static catalog item being edited), create it directly
      let imageUrl = req.body.imageUrl || "";
      if (req.file) {
        imageUrl = await processAndSaveImage(req.file, "portfolio");
      }
      if (!imageUrl) {
        imageUrl = "/images/portfolio/portrait-elder-woman.png";
      }

      const created = await prisma.portfolioPiece.create({
        data: {
          id: id.startsWith("piece-") ? id : undefined,
          title: req.body.title || "Untitled Artwork",
          serviceId: req.body.serviceId || null,
          category: req.body.category || "dark-realism",
          categoryLabel: req.body.categoryLabel || req.body.category || "Dark Realism",
          artist: req.body.artist || "Marvin",
          healingState: req.body.healingState || "Healed Masterpiece",
          cycle: req.body.cycle || "healed",
          zone: req.body.zone || "Forearm",
          flashId: req.body.flashId || null,
          imageUrl,
          description: req.body.description || "",
          duration: req.body.duration || null,
          pigment: req.body.pigment || "Dynamic Triple Black",
          featured: req.body.featured === "true" || req.body.featured === true,
          sortOrder: req.body.sortOrder ? parseInt(req.body.sortOrder, 10) : 0,
        },
        include: {
          service: {
            select: {
              id: true,
              title: true,
              disciplineNumber: true,
              category: true,
            },
          },
        },
      });

      res.json({
        success: true,
        message: "Portfolio piece updated successfully",
        data: created,
      });
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
      serviceId,
      category,
      categoryLabel,
      artist,
      healingState,
      cycle,
      zone,
      flashId,
      description,
      duration,
      pigment,
      featured,
      sortOrder,
    } = req.body;

    const updated = await prisma.portfolioPiece.update({
      where: { id: existing.id },
      data: {
        ...(title && { title }),
        ...(serviceId !== undefined && { serviceId: serviceId || null }),
        ...(category && { category }),
        ...(categoryLabel && { categoryLabel }),
        ...(artist !== undefined && { artist }),
        ...(healingState !== undefined && { healingState }),
        ...(cycle !== undefined && { cycle }),
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
      include: {
        service: {
          select: {
            id: true,
            title: true,
            disciplineNumber: true,
            category: true,
          },
        },
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
