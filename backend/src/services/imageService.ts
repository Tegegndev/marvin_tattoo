import sharp from "sharp";
import path from "path";
import fs from "fs";

export async function processAndSaveImage(
  file: Express.Multer.File,
  prefix: string = "media"
): Promise<string> {
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}.webp`;
  const outputPath = path.join(uploadDir, filename);

  try {
    await sharp(file.path)
      .resize({ width: 2048, withoutEnlargement: true, fit: "inside" })
      .webp({ quality: 85 })
      .toFile(outputPath);

    // Remove the raw uncompressed temporary file
    if (fs.existsSync(file.path) && file.path !== outputPath) {
      fs.unlinkSync(file.path);
    }

    return `/uploads/${filename}`;
  } catch (error) {
    // If sharp fails, fallback to keeping the raw uploaded file
    console.error("Error processing image with sharp:", error);
    return `/uploads/${path.basename(file.path)}`;
  }
}

export function deleteLocalImage(imageRelativeUrl: string): void {
  if (!imageRelativeUrl || !imageRelativeUrl.startsWith("/uploads/")) {
    return;
  }

  const filename = path.basename(imageRelativeUrl);
  const filePath = path.join(process.cwd(), "uploads", filename);

  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete local image: ${filePath}`, err);
    }
  }
}
