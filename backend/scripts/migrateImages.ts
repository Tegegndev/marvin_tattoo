import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const BUCKET_URL = process.env.IMAGE_BUCKET_URL || "https://images.tegegn.com.et";
const API_KEY = process.env.IMAGE_BUCKET_API_KEY || "";

async function uploadFile(filePath: string, folder: string): Promise<string> {
  const fileBuffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);

  const formData = new FormData();
  const blob = new Blob([fileBuffer], { type: "image/png" });
  formData.append("image", blob, filename);
  formData.append("folder", folder);

  const headers: Record<string, string> = {};
  if (API_KEY) {
    headers["Authorization"] = `Bearer ${API_KEY}`;
  }

  const endpoint = `${BUCKET_URL.replace(/\/$/, "")}/upload.php`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Upload failed for ${filename} (${res.status}): ${await res.text()}`);
  }

  const json = (await res.json()) as { success: boolean; data?: { url: string }; error?: string };
  if (!json.success || !json.data?.url) {
    throw new Error(`Bucket rejected ${filename}: ${json.error}`);
  }

  return json.data.url;
}

async function main() {
  console.log(`🚀 Starting Image Migration to Bucket (${BUCKET_URL})...\n`);

  const publicDir = path.resolve(process.cwd(), "../public");
  
  const filesToUpload = [
    { localRel: "/images/hero-banner.png", folder: "shop" },
    { localRel: "/images/marvin-founder.png", folder: "team" },
    { localRel: "/images/portfolio/script-abdul-collarbone.png", folder: "portfolio" },
    { localRel: "/images/portfolio/cosmetic-eyebrow-pmu.png", folder: "portfolio" },
    { localRel: "/images/portfolio/back-portrait-man.png", folder: "portfolio" },
    { localRel: "/images/portfolio/portrait-elder-woman.png", folder: "portfolio" },
    { localRel: "/images/portfolio/spider-navel-piercing.png", folder: "portfolio" },
    { localRel: "/logo.png", folder: "branding" },
    { localRel: "/logo-black.png", folder: "branding" },
  ];

  const urlMap: Record<string, string> = {};

  for (const item of filesToUpload) {
    const fullPath = path.join(publicDir, item.localRel);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ File not found locally: ${fullPath}`);
      continue;
    }

    try {
      const cdnUrl = await uploadFile(fullPath, item.folder);
      urlMap[item.localRel] = cdnUrl;
      console.log(`✅ Uploaded [${item.folder}]: ${item.localRel} -> ${cdnUrl}`);
    } catch (err: any) {
      console.error(`❌ Failed to upload ${item.localRel}:`, err.message);
    }
  }

  console.log("\n--- URL Mapping Result ---");
  console.log(JSON.stringify(urlMap, null, 2));

  // Update Database records
  console.log("\n🔄 Updating Database records...");

  // 1. Update Site Settings (Hero Banner)
  if (urlMap["/images/hero-banner.png"]) {
    try {
      const updated = await prisma.siteSetting.updateMany({
        data: {
          heroBannerUrl: urlMap["/images/hero-banner.png"],
        },
      });
      console.log(` Updated ${updated.count} SiteSetting heroBannerUrl`);
    } catch (e: any) {
      console.warn("Could not update SiteSetting:", e.message);
    }
  }

  // 2. Update Member Avatars
  if (urlMap["/images/marvin-founder.png"]) {
    try {
      const updated = await prisma.member.updateMany({
        where: { avatar: { contains: "marvin-founder" } },
        data: { avatar: urlMap["/images/marvin-founder.png"] },
      });
      console.log(` Updated ${updated.count} Member avatar(s)`);
    } catch (e: any) {
      console.warn("Could not update Member:", e.message);
    }
  }

  // 3. Update Portfolio Pieces
  for (const [oldPath, newUrl] of Object.entries(urlMap)) {
    const baseName = path.basename(oldPath, path.extname(oldPath));
    try {
      const updated = await prisma.portfolioPiece.updateMany({
        where: { imageUrl: { contains: baseName } },
        data: { imageUrl: newUrl },
      });
      if (updated.count > 0) {
        console.log(` Updated ${updated.count} PortfolioPiece(s) for ${oldPath} -> ${newUrl}`);
      }
    } catch (e: any) {
      console.warn(`Could not update PortfolioPiece for ${oldPath}:`, e.message);
    }
  }

  // 4. Update Services (galleryImages JSON arrays and imageUrl)
  try {
    const services = await prisma.service.findMany();
    for (const service of services) {
      let modified = false;
      let newImageUrl = service.imageUrl;

      for (const [oldPath, newUrl] of Object.entries(urlMap)) {
        const baseName = path.basename(oldPath, path.extname(oldPath));
        if (service.imageUrl && service.imageUrl.includes(baseName)) {
          newImageUrl = newUrl;
          modified = true;
        }
      }

      let newGallery: string[] = [];
      if (service.galleryImages) {
        try {
          const gallery = JSON.parse(service.galleryImages);
          if (Array.isArray(gallery)) {
            newGallery = gallery.map((img) => {
              for (const [oldPath, newUrl] of Object.entries(urlMap)) {
                const baseName = path.basename(oldPath, path.extname(oldPath));
                if (img.includes(baseName) || img === oldPath) {
                  modified = true;
                  return newUrl;
                }
              }
              return img;
            });
          }
        } catch {}
      }

      if (modified) {
        await prisma.service.update({
          where: { id: service.id },
          data: {
            imageUrl: newImageUrl,
            galleryImages: JSON.stringify(newGallery),
          },
        });
        console.log(` Updated Service images for: ${service.title}`);
      }
    }
  } catch (e: any) {
    console.warn("Could not update Services:", e.message);
  }

  console.log("\n🎉 Database migration to CDN URLs completed successfully!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
