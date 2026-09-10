import multer from "multer";
import path from "path";
import fs from "fs";
import os from "os";

// Safe upload directory resolution (handles read-only serverless filesystems like Vercel/Lambda)
export function getUploadDir(): string {
  const isServerless = Boolean(process.env.VERCEL || process.env.NOW_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const targetDir = isServerless ? path.join(os.tmpdir(), "uploads") : path.join(process.cwd(), "uploads");

  try {
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
  } catch (_err) {
    const fallbackDir = path.join(os.tmpdir(), "uploads");
    try {
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true });
      }
    } catch {}
    return fallbackDir;
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, getUploadDir());
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files (JPG, PNG, WebP) are allowed"));
  },
});

