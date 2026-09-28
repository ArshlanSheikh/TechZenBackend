import express from "express";
import multer from "multer";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { Authontication, Authorization } from "../../user/middleware/AuthMiddleware.js";

const router = express.Router();
const uploadDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../uploads/cms");
fs.mkdirSync(uploadDirectory, { recursive: true });
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) return callback(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
    return callback(null, true);
  },
});

router.post("/", Authontication, Authorization(["admin"]), upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required", data: null, error: "IMAGE_REQUIRED" });
  }

  const baseUrl = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get("host")}`;
  return res.status(201).json({
    success: true,
    message: "Image uploaded successfully",
    data: { url: `${baseUrl}/uploads/cms/${req.file.filename}` },
    error: null,
  });
});

router.use((error, _req, res, _next) => res.status(400).json({
  success: false,
  message: error.message || "Unable to upload image",
  data: null,
  error: "INVALID_UPLOAD",
}));

export default router;