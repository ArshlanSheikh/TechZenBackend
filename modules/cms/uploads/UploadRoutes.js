import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Authontication, Authorization } from "../../user/middleware/AuthMiddleware.js";

const router = express.Router();
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) return callback(new Error("Only JPEG, PNG, WebP, or GIF images are allowed"));
    return callback(null, true);
  },
});


const uploadToCloudinary = (buffer) => new Promise((resolve, reject) => {
  
  console.log('hit uploadToCloudinary function');
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  console.info("[upload] Cloudinary upload starting", {
    sizeBytes: buffer.length,
    hasCloudName: Boolean(cloudName),
    hasApiKey: Boolean(apiKey),
    hasApiSecret: Boolean(apiSecret),
  });


  if (!cloudName || !apiKey || !apiSecret) {
    return reject(Object.assign(new Error("Cloudinary credentials are not configured"), { statusCode: 500 }));
  }

  cloudinary.config(
    { cloud_name: cloudName, 
      api_key: apiKey, 
      api_secret: apiSecret, 
      secure: true 
    }
  );


  cloudinary.uploader.upload_stream(
    { folder: "techZen", resource_type: "image" },
    (error, result) => {
      if (error) {
        console.error("[upload] Cloudinary rejected image", {
          code: error.code || null,
          httpCode: error.http_code || null,
          message: error.message || "Unknown Cloudinary error",
        });
        
        const uploadError = new Error(error.message || "Unable to upload image to Cloudinary");
        uploadError.statusCode = 502;
        return reject(uploadError);
      }
      console.info("[upload] Cloudinary upload succeeded", {
        publicId: result?.public_id || null,
        hasSecureUrl: Boolean(result?.secure_url),
      });
      return resolve(result);
    },
  ).end(buffer);
});



router.post("/", (req, _res, next) => {
  console.info("[upload] request received", {
    contentType: req.get("content-type")?.split(";")[0] || null,
    hasMultipartBoundary: Boolean(req.get("content-type")?.includes("boundary=")),
  });
  next();
}, Authontication, Authorization(["admin"]), upload.single("image"), async (req, res, next) => {
  console.info("[upload] multipart parsed", {
    hasFile: Boolean(req.file),
    fieldName: req.file?.fieldname || null,
    mimeType: req.file?.mimetype || null,
    sizeBytes: req.file?.size || 0,
  });

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Image file is required", data: null, error: "IMAGE_REQUIRED" });
  }

  try {
    const result = await uploadToCloudinary(req.file.buffer);
    return res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: { url: result.secure_url },
      error: null,
    });
  } catch (error) {
    return next(error);  
  }
});

router.use((error, _req, res, _next) => {
  console.error("[upload] request failed", {
    name: error.name || null,
    code: error.code || null,
    statusCode: error.statusCode || 400,
    message: error.message || "Unable to upload image",
  });
  return res.status(error.statusCode || 400).json({
    success: false,
    message: error.message || "Unable to upload image",
    data: null,
    error: error.statusCode ? "CLOUDINARY_UPLOAD_FAILED" : "INVALID_UPLOAD",
  });
});

export default router;