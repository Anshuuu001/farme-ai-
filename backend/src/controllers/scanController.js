import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { getPool } from '../db/connection.js';
import { runInference } from '../services/inferenceService.js';
import { getGuidanceForLabel } from '../services/guidanceService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

// Ensure uploads directory exists for safe local storage
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function detectDisease(req, res) {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file || !file.buffer) {
      return res.status(400).json({
        success: false,
        error: 'No leaf image provided. Upload an image under the "image" field.'
      });
    }

    // 1. Run real ONNX inference via MobileNetV2
    const inferenceResult = await runInference(file.buffer);

    // 2. Safe Storage Design:
    // Generate a sanitized, unique filename and store an optimized, clean 600px preview image
    // This prevents storing arbitrary executable binaries or excessive multi-megabyte files on disk
    const scanId = `SCN-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const safeFilename = `${scanId}_leaf.webp`;
    const targetDiskPath = path.join(UPLOADS_DIR, safeFilename);

    await sharp(file.buffer)
      .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(targetDiskPath);

    const publicPath = `/uploads/${safeFilename}`;

    // 3. Persist record to MySQL with strict user_id ownership
    await getPool().query(
      `INSERT INTO scans 
       (id, user_id, image_name, image_path, disease_key, disease_name, scientific_name, severity, confidence, is_healthy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        scanId,
        userId,
        file.originalname || safeFilename,
        publicPath,
        inferenceResult.diseaseKey,
        inferenceResult.displayName,
        inferenceResult.scientificName,
        inferenceResult.severity,
        inferenceResult.confidence,
        inferenceResult.isHealthy
      ]
    );

    return res.status(200).json({
      success: true,
      scanId,
      result: {
        ...inferenceResult,
        imagePath: publicPath,
        fileName: file.originalname || safeFilename,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('[Detect Disease Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Inference pipeline failure. Unable to process leaf image.'
    });
  }
}

export async function getScanHistory(req, res) {
  try {
    const userId = req.user.id;

    // Enforce ownership in SQL: strictly SELECT where user_id = authenticated user
    const [rows] = await getPool().query(
      `SELECT id, image_name, image_path, disease_key, disease_name, scientific_name, severity, confidence, is_healthy, created_at 
       FROM scans 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    return res.status(200).json({
      success: true,
      count: rows.length,
      scans: rows
    });
  } catch (err) {
    console.error('[Get History Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to retrieve scan history.'
    });
  }
}

export async function getScanById(req, res) {
  try {
    const userId = req.user.id;
    const scanId = req.params.id;

    if (!scanId) {
      return res.status(400).json({ success: false, error: 'Scan ID is required.' });
    }

    const [rows] = await getPool().query(
      `SELECT id, image_name, image_path, disease_key, disease_name, scientific_name, severity, confidence, is_healthy, created_at 
       FROM scans 
       WHERE id = ? AND user_id = ?`,
      [scanId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Scan record not found or unauthorized.'
      });
    }

    const scan = rows[0];
    const guidance = getGuidanceForLabel(scan.disease_name || scan.disease_key);

    return res.status(200).json({
      success: true,
      scan: {
        id: scan.id,
        diseaseKey: scan.disease_key,
        displayName: scan.disease_name,
        scientificName: scan.scientific_name,
        severity: scan.severity,
        confidence: Number(scan.confidence),
        isHealthy: Boolean(scan.is_healthy),
        imagePath: scan.image_path,
        fileName: scan.image_name,
        createdAt: scan.created_at,
        isLowConfidence: Number(scan.confidence) < 60,
        ...guidance
      }
    });
  } catch (err) {
    console.error('[Get Scan Detail Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to retrieve scan details.'
    });
  }
}

export async function deleteScan(req, res) {
  try {
    const userId = req.user.id;
    const scanId = req.params.id;

    if (!scanId) {
      return res.status(400).json({ success: false, error: 'Scan ID is required.' });
    }

    // First fetch to delete disk file if exists (strictly checking user_id in SQL)
    const [rows] = await getPool().query(
      'SELECT image_path FROM scans WHERE id = ? AND user_id = ?',
      [scanId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Scan record not found or unauthorized to delete.'
      });
    }

    const imagePath = rows[0].image_path;

    // Strict ownership delete in SQL
    const [deleteResult] = await getPool().query(
      'DELETE FROM scans WHERE id = ? AND user_id = ?',
      [scanId, userId]
    );

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Scan record not found or unauthorized to delete.'
      });
    }

    // Clean up local disk image if stored
    if (imagePath && imagePath.startsWith('/uploads/')) {
      const diskFile = path.join(UPLOADS_DIR, path.basename(imagePath));
      if (fs.existsSync(diskFile)) {
        try {
          fs.unlinkSync(diskFile);
        } catch (unlinkErr) {
          console.warn('[Storage Warning] Could not remove file on disk:', diskFile);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Scan record deleted successfully.',
      deletedScanId: scanId
    });
  } catch (err) {
    console.error('[Delete Scan Error]:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to delete scan record.'
    });
  }
}
