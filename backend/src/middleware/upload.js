import multer from 'multer';
import sharp from 'sharp';
import { config } from '../config/index.js';

// Memory storage keeps processing ephemeral and memory-safe
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = config.upload.allowedMimeTypes;
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_MIME_TYPE: Only JPEG, PNG, and WebP images are permitted.'), false);
  }
};

const uploadInstance = multer({
  storage,
  limits: {
    fileSize: config.upload.maxSizeBytes // 10 MB
  },
  fileFilter
}).single('image');

// Wrapper middleware for multer with safe error handling and deep magic-byte inspection
export async function handleImageUpload(req, res, next) {
  uploadInstance(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File size exceeds maximum permitted limit of 10 MB.'
        });
      }
      return res.status(400).json({
        success: false,
        error: err.message || 'File upload failed.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No leaf image provided. Please upload an image using field name "image".'
      });
    }

    // Deep inspection: verify file buffer actually contains valid image data (not spoofed MIME)
    try {
      const metadata = await sharp(req.file.buffer).metadata();
      const validFormats = ['jpeg', 'png', 'webp'];
      if (!metadata.format || !validFormats.includes(metadata.format)) {
        return res.status(400).json({
          success: false,
          error: `Invalid image content. File claims to be an image but contains ${metadata.format || 'unsupported'} data.`
        });
      }
      // Attach verified metadata
      req.imageMeta = {
        format: metadata.format,
        width: metadata.width,
        height: metadata.height,
        channels: metadata.channels,
        sizeBytes: req.file.size
      };
      next();
    } catch (sharpError) {
      return res.status(400).json({
        success: false,
        error: 'Corrupt or unreadable image file. Magic byte validation failed.'
      });
    }
  });
}
