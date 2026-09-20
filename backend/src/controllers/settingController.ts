import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { processAndSaveImage, deleteLocalImage } from "../services/imageService.js";

export const DEFAULT_SOCIAL_LINKS = [
  {
    id: "soc-1",
    platform: "instagram",
    label: "Instagram (@Marvintattoos256)",
    url: "https://instagram.com/Marvintattoos256",
    icon: "instagram",
    active: true,
  },
  {
    id: "soc-2",
    platform: "tiktok",
    label: "TikTok (@Marvintattoos256)",
    url: "https://tiktok.com/@Marvintattoos256",
    icon: "tiktok",
    active: true,
  },
  {
    id: "soc-3",
    platform: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/256705748774",
    icon: "whatsapp",
    active: true,
  },
  {
    id: "soc-4",
    platform: "facebook",
    label: "Facebook",
    url: "https://facebook.com/marvintattoosug",
    icon: "facebook",
    active: true,
  },
  {
    id: "soc-5",
    platform: "maps",
    label: "Google Maps",
    url: "https://maps.google.com/?q=New+Pioneer+Mall+Kampala",
    icon: "map-pin",
    active: true,
  },
];

export const getSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: "studio_config" },
    });

    if (!settings) {
      // Fallback default creation if not seeded
      settings = await prisma.siteSetting.create({
        data: {
          id: "studio_config",
          studioName: "Marvin Tattoo Studio",
          heroStatement: "Clean Lines. Heavy Blackwork. Made to Age Well.",
          heroSubtext:
            "Kampala's premier sanctuary for bespoke dark realism, clean fine-line, and custom body art. 14+ years of master craft.",
          heroBannerUrl: "/images/hero-banner.png",
          heroOpacity: 0.45,
          announcementActive: false,
          announcementText: null,
          primaryPhone: "+256705748774",
          whatsappNumber: "+256705748774",
          contactEmail: "info@marvintattoos.com",
          physicalAddress: "New Pioneer Mall, Shop No. Pi55, Level 5, Burton Street, Kampala",
          googleMapsUrl: "https://maps.google.com/?q=New+Pioneer+Mall+Kampala",
          openingHours: JSON.stringify([
            { day: "Monday - Saturday", hours: "10:00 AM - 8:00 PM" },
            { day: "Sunday", hours: "By Appointment Only" },
          ]),
          socialLinks: JSON.stringify(DEFAULT_SOCIAL_LINKS),
        },
      });
    }

    const parseSafe = (val: any, fallback: any = []) => {
      if (!val) return fallback;
      if (typeof val === "object") return val;
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    };

    const parsedSocials = parseSafe(settings.socialLinks, DEFAULT_SOCIAL_LINKS);

    res.json({
      success: true,
      data: {
        ...settings,
        openingHours: parseSafe(settings.openingHours, []),
        socialLinks: parsedSocials,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      studioName,
      heroStatement,
      heroSubtext,
      heroOpacity,
      announcementActive,
      announcementText,
      primaryPhone,
      whatsappNumber,
      contactEmail,
      physicalAddress,
      googleMapsUrl,
      openingHours,
      socialLinks,
      logoUrl,
      metaTitle,
      metaDescription,
      ogImageUrl,
      heroPortraitUrl,
    } = req.body;

    const trimmedStudioName = typeof studioName === "string" ? studioName.trim() : undefined;

    const updated = await prisma.siteSetting.upsert({
      where: { id: "studio_config" },
      update: {
        ...(trimmedStudioName ? { studioName: trimmedStudioName } : {}),
        ...(heroStatement && { heroStatement }),
        ...(heroSubtext !== undefined && { heroSubtext }),
        ...(heroOpacity !== undefined && {
          heroOpacity: parseFloat(heroOpacity),
        }),
        ...(announcementActive !== undefined && {
          announcementActive:
            announcementActive === true || announcementActive === "true",
        }),
        ...(announcementText !== undefined && { announcementText }),
        ...(primaryPhone && { primaryPhone }),
        ...(whatsappNumber && { whatsappNumber }),
        ...(contactEmail && { contactEmail }),
        ...(physicalAddress && { physicalAddress }),
        ...(googleMapsUrl && { googleMapsUrl }),
        ...(heroPortraitUrl !== undefined && { heroPortraitUrl }),
        ...(logoUrl !== undefined && { logoUrl }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(ogImageUrl !== undefined && { ogImageUrl }),
        ...(openingHours !== undefined && {
          openingHours:
            typeof openingHours === "object"
              ? JSON.stringify(openingHours)
              : openingHours,
        }),
        ...(socialLinks !== undefined && {
          socialLinks:
            typeof socialLinks === "object"
              ? JSON.stringify(socialLinks)
              : socialLinks,
        }),
      },
      create: {
        id: "studio_config",
        studioName: trimmedStudioName || "Marvin Tattoo Studio",
        heroStatement:
          heroStatement || "Clean Lines. Heavy Blackwork. Made to Age Well.",
        heroSubtext: heroSubtext || "",
        heroBannerUrl: "/images/hero-banner.png",
        heroOpacity: heroOpacity ? parseFloat(heroOpacity) : 0.45,
        announcementActive: announcementActive === true || announcementActive === "true",
        announcementText: announcementText || null,
        primaryPhone: primaryPhone || "+256705748774",
        whatsappNumber: whatsappNumber || "+256705748774",
        contactEmail: contactEmail || "info@marvintattoos.com",
        physicalAddress:
          physicalAddress || "New Pioneer Mall, Shop No. Pi55, Level 5, Burton Street, Kampala",
        googleMapsUrl:
          googleMapsUrl || "https://maps.google.com/?q=New+Pioneer+Mall+Kampala",
        logoUrl: logoUrl || "/logo.svg",
        metaTitle: metaTitle || "Marvin Tattoos & Piercing Atelier | Kampala, Uganda",
        metaDescription: metaDescription || null,
        ogImageUrl: ogImageUrl || null,
        openingHours:
          typeof openingHours === "object"
            ? JSON.stringify(openingHours)
            : openingHours || "[]",
        socialLinks:
          typeof socialLinks === "object"
            ? JSON.stringify(socialLinks)
            : socialLinks || "[]",
      },
    });

    const parseSafe = (val: any, fallback: any = []) => {
      if (!val) return fallback;
      if (typeof val === "object") return val;
      try {
        return JSON.parse(val);
      } catch {
        return fallback;
      }
    };

    res.json({
      success: true,
      message: "Studio settings updated successfully",
      data: {
        ...updated,
        openingHours: parseSafe(updated.openingHours, []),
        socialLinks: parseSafe(updated.socialLinks, DEFAULT_SOCIAL_LINKS),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateHeroImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "A heroImage file is required",
      });
      return;
    }

    const existing = await prisma.siteSetting.findUnique({
      where: { id: "studio_config" },
    });

    if (existing && existing.heroBannerUrl) {
      deleteLocalImage(existing.heroBannerUrl);
    }

    const heroBannerUrl = await processAndSaveImage(req.file, "hero-banner");

    const updated = await prisma.siteSetting.upsert({
      where: { id: "studio_config" },
      update: { heroBannerUrl },
      create: {
        id: "studio_config",
        heroBannerUrl,
        openingHours: "[]",
        socialLinks: JSON.stringify(DEFAULT_SOCIAL_LINKS),
      },
    });

    res.json({
      success: true,
      message: "Hero banner image updated successfully",
      heroBannerUrl: updated.heroBannerUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLogo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "A logo file is required",
      });
      return;
    }

    const existing = await prisma.siteSetting.findUnique({
      where: { id: "studio_config" },
    });

    if (existing && existing.logoUrl && existing.logoUrl !== "/logo.svg") {
      deleteLocalImage(existing.logoUrl);
    }

    const logoUrl = await processAndSaveImage(req.file, "logo");

    const updated = await prisma.siteSetting.upsert({
      where: { id: "studio_config" },
      update: { logoUrl },
      create: {
        id: "studio_config",
        logoUrl,
        openingHours: "[]",
        socialLinks: JSON.stringify(DEFAULT_SOCIAL_LINKS),
      },
    });

    res.json({
      success: true,
      message: "Studio logo updated successfully",
      logoUrl: updated.logoUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOgImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "An ogImage file is required",
      });
      return;
    }

    const existing = await prisma.siteSetting.findUnique({
      where: { id: "studio_config" },
    });

    if (existing && existing.ogImageUrl) {
      deleteLocalImage(existing.ogImageUrl);
    }

    const ogImageUrl = await processAndSaveImage(req.file, "seo-og");

    const updated = await prisma.siteSetting.upsert({
      where: { id: "studio_config" },
      update: { ogImageUrl },
      create: {
        id: "studio_config",
        ogImageUrl,
        openingHours: "[]",
        socialLinks: JSON.stringify(DEFAULT_SOCIAL_LINKS),
      },
    });

    res.json({
      success: true,
      message: "Social share image updated successfully",
      ogImageUrl: updated.ogImageUrl,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHeroPortrait = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "A portrait image file is required",
      });
      return;
    }

    const existing = await prisma.siteSetting.findUnique({
      where: { id: "studio_config" },
    });

    if (
      existing &&
      existing.heroPortraitUrl &&
      existing.heroPortraitUrl !== "/images/marvin-founder.png"
    ) {
      deleteLocalImage(existing.heroPortraitUrl);
    }

    const heroPortraitUrl = await processAndSaveImage(req.file, "founder-portrait");

    const updated = await prisma.siteSetting.upsert({
      where: { id: "studio_config" },
      update: { heroPortraitUrl },
      create: {
        id: "studio_config",
        heroPortraitUrl,
        openingHours: "[]",
        socialLinks: JSON.stringify(DEFAULT_SOCIAL_LINKS),
      },
    });

    res.json({
      success: true,
      message: "Landing page founder portrait updated successfully",
      heroPortraitUrl: updated.heroPortraitUrl,
    });
  } catch (error) {
    next(error);
  }
};
