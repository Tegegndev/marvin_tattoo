import sharp from "sharp";
import path from "path";
import fs from "fs";
import { getUploadDir } from "../config/multer.js";
import { env } from "../config/env.js";

/**
 * Uploads an image buffer or file to the remote PHP Image Bucket CDN.
 */
async function uploadToRemoteBucket(
  buffer: Buffer,
  originalFilename: string,
  folder: string
): Promise<string | null> {
  if (!env.IMAGE_BUCKET_URL) {
    return null;
  }

  try {
    const formData = new FormData();
    const blob = new Blob([buffer], { type: "image/webp" });
    formData.append("image", blob, originalFilename);
    formData.append("folder", folder);

    const headers: Record<string, string> = {};
    if (env.IMAGE_BUCKET_API_KEY) {
      headers["Authorization"] = `Bearer ${env.IMAGE_BUCKET_API_KEY}`;
    }

    const uploadEndpoint = `${env.IMAGE_BUCKET_URL.replace(/\/$/, "")}/upload.php`;
    const response = await fetch(uploadEndpoint, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[ImageBucket] Upload failed (${response.status}):`, errText);
      return null;
    }

    const data = (await response.json()) as { success?: boolean; data?: { url?: string } };
    if (data.success && data.data?.url) {
      return data.data.url;
    }

    return null;
  } catch (error) {
    console.error("[ImageBucket] Network/Upload error:", error);
    return null;
  }
}

/**
 * Optimizes an image (converting to WebP) and saves to remote CDN or local fallback.
 */
export async function processAndSaveImage(
  file: Express.Multer.File,
  prefix: string = "media"
): Promise<string> {
  const uploadDir = getUploadDir();
  const filename = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
  const outputPath = path.join(uploadDir, filename);

  try {
    // 1. Optimize and convert image to WebP buffer
    let processedBuffer: Buffer;
    if (file.mimetype === "image/svg+xml" || file.mimetype === "image/gif") {
      processedBuffer = fs.readFileSync(file.path);
    } else {
      processedBuffer = await sharp(file.path)
        .resize({ width: 2048, withoutEnlargement: true, fit: "inside" })
        .webp({ quality: 85 })
        .toBuffer();
    }

    // 2. Attempt upload to remote Image Bucket CDN
    const remoteUrl = await uploadToRemoteBucket(processedBuffer, filename, prefix);

    // Clean up temporary multer file
    if (fs.existsSync(file.path)) {
      try {
        fs.unlinkSync(file.path);
      } catch {}
    }

    if (remoteUrl) {
      console.log(`[ImageBucket] Image uploaded to CDN: ${remoteUrl}`);
      return remoteUrl;
    }

    // 3. Fallback: Save to local disk if remote upload fails
    console.warn(`[ImageBucket] Falling back to local storage for: ${filename}`);
    fs.writeFileSync(outputPath, processedBuffer);
    return `/uploads/${filename}`;
  } catch (error) {
    console.error("Error processing image:", error);

    // Fallback: Return raw local path if everything else fails
    if (fs.existsSync(file.path)) {
      return `/uploads/${path.basename(file.path)}`;
    }
    return `/uploads/${filename}`;
  }
}

/**
 * Deletes an image from either remote Image Bucket CDN or local storage.
 */
export async function deleteLocalImage(imageUrl: string): Promise<void> {
  if (!imageUrl) return;

  // 1. If it's a remote Image Bucket URL
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    if (env.IMAGE_BUCKET_URL && imageUrl.includes(new URL(env.IMAGE_BUCKET_URL).hostname)) {
      try {
        const deleteEndpoint = `${env.IMAGE_BUCKET_URL.replace(/\/$/, "")}/delete.php`;
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (env.IMAGE_BUCKET_API_KEY) {
          headers["Authorization"] = `Bearer ${env.IMAGE_BUCKET_API_KEY}`;
        }

        await fetch(deleteEndpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({ url: imageUrl }),
        });
      } catch (err) {
        console.error(`Failed to delete remote image from bucket: ${imageUrl}`, err);
      }
    }
    return;
  }

  // 2. If it's a local /uploads/ relative path
  if (imageUrl.startsWith("/uploads/")) {
    const filename = path.basename(imageUrl);
    const filePath = path.join(getUploadDir(), filename);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete local image: ${filePath}`, err);
      }
    }
  }
}
