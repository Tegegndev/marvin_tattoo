import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database.js";
import { processAndSaveImage, deleteLocalImage } from "../services/imageService.js";

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
          socialLinks: JSON.stringify([
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
          ]),
        },
      });
    }

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
      data: {
        ...settings,
        openingHours: parseSafe(settings.openingHours, []),
        socialLinks: parseSafe(settings.socialLinks, []),
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
        socialLinks: parseSafe(updated.socialLinks, []),
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

    if (existing && existing.heroBannerUrl.startsWith("/uploads/")) {
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
        socialLinks: "[]",
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
