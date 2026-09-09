import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { processAndSaveImage, deleteLocalImage } from "../services/imageService.js";

export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { active, search } = req.query;

    const where: any = {};
    if (active === "true") {
      where.active = true;
    } else if (active === "false") {
      where.active = false;
    }

    if (search && typeof search === "string" && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { title: { contains: q } },
        { specialty: { contains: q } },
        { role: { contains: q } },
      ];
    }

    const members = await prisma.member.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    const formatted = members.map((m) => {
      let badges: string[] = [];
      if (typeof m.badges === "string") {
        try {
          const parsed = JSON.parse(m.badges);
          badges = Array.isArray(parsed) ? parsed : [m.badges];
        } catch {
          badges = m.badges ? m.badges.split(",").map((s) => s.trim()).filter(Boolean) : [];
        }
      } else if (Array.isArray(m.badges)) {
        badges = m.badges;
      }

      return {
        ...m,
        badges,
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error) {
    next(error);
  }
};

export const getMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const member = await prisma.member.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!member) {
      res.status(404).json({ success: false, message: "Team member not found" });
      return;
    }

    let badges: string[] = [];
    if (typeof member.badges === "string") {
      try {
        const parsed = JSON.parse(member.badges);
        badges = Array.isArray(parsed) ? parsed : [member.badges];
      } catch {
        badges = member.badges ? member.badges.split(",").map((s) => s.trim()).filter(Boolean) : [];
      }
    }

    res.json({
      success: true,
      data: {
        ...member,
        badges,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      title,
      role,
      experience,
      specialty,
      slotsRemaining,
      bio,
      badges,
      instagram,
      active,
      sortOrder,
      slug,
    } = req.body;

    if (!name || !title || !bio) {
      res.status(400).json({
        success: false,
        message: "Name, title, and bio/description are required.",
      });
      return;
    }

    let avatar = req.body.avatar || req.body.imageUrl || "";
    if (req.file) {
      avatar = await processAndSaveImage(req.file, "team");
    }

    if (!avatar) {
      avatar = "/images/marvin-founder.png";
    }

    let parsedBadges: string = "[]";
    if (badges) {
      if (typeof badges === "string") {
        try {
          const arr = JSON.parse(badges);
          parsedBadges = Array.isArray(arr) ? JSON.stringify(arr) : JSON.stringify([badges]);
        } catch {
          parsedBadges = JSON.stringify(
            badges.split(",").map((s: string) => s.trim()).filter(Boolean)
          );
        }
      } else if (Array.isArray(badges)) {
        parsedBadges = JSON.stringify(badges);
      }
    }

    const generatedSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const created = await prisma.member.create({
      data: {
        slug: generatedSlug,
        name,
        title,
        role: role || title,
        avatar,
        experience: experience || "1+ Years",
        specialty: specialty || "Custom Artistry",
        slotsRemaining: slotsRemaining !== undefined ? parseInt(slotsRemaining, 10) : 4,
        bio,
        badges: parsedBadges,
        instagram: instagram || null,
        active: active !== undefined ? active === true || active === "true" : true,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : 0,
      },
    });

    res.status(201).json({
      success: true,
      message: "Team member added successfully",
      data: {
        ...created,
        badges: JSON.parse(created.badges),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.member.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: "Team member not found" });
      return;
    }

    let avatar = existing.avatar;
    if (req.file) {
      deleteLocalImage(existing.avatar);
      avatar = await processAndSaveImage(req.file, "team");
    } else if (req.body.avatar) {
      avatar = req.body.avatar;
    } else if (req.body.imageUrl) {
      avatar = req.body.imageUrl;
    }

    const {
      name,
      title,
      role,
      experience,
      specialty,
      slotsRemaining,
      bio,
      badges,
      instagram,
      active,
      sortOrder,
      slug,
    } = req.body;

    let parsedBadges: string | undefined = undefined;
    if (badges !== undefined) {
      if (typeof badges === "string") {
        try {
          const arr = JSON.parse(badges);
          parsedBadges = Array.isArray(arr) ? JSON.stringify(arr) : JSON.stringify([badges]);
        } catch {
          parsedBadges = JSON.stringify(
            badges.split(",").map((s: string) => s.trim()).filter(Boolean)
          );
        }
      } else if (Array.isArray(badges)) {
        parsedBadges = JSON.stringify(badges);
      }
    }

    const updated = await prisma.member.update({
      where: { id: existing.id },
      data: {
        ...(name && { name }),
        ...(slug !== undefined && { slug }),
        ...(title && { title }),
        ...(role !== undefined && { role }),
        ...(avatar && { avatar }),
        ...(experience !== undefined && { experience }),
        ...(specialty !== undefined && { specialty }),
        ...(slotsRemaining !== undefined && {
          slotsRemaining: parseInt(slotsRemaining, 10),
        }),
        ...(bio && { bio }),
        ...(parsedBadges !== undefined && { badges: parsedBadges }),
        ...(instagram !== undefined && { instagram }),
        ...(active !== undefined && {
          active: active === true || active === "true",
        }),
        ...(sortOrder !== undefined && {
          sortOrder: parseInt(sortOrder, 10),
        }),
      },
    });

    res.json({
      success: true,
      message: "Team member updated successfully",
      data: {
        ...updated,
        badges: JSON.parse(updated.badges),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const existing = await prisma.member.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: "Team member not found" });
      return;
    }

    deleteLocalImage(existing.avatar);
    await prisma.member.delete({ where: { id: existing.id } });

    res.json({ success: true, message: "Team member deleted successfully" });
  } catch (error) {
    next(error);
  }
};
