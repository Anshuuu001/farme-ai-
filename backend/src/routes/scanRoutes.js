import express from 'express';
import { detectDisease, getScanHistory, getScanById, deleteScan } from '../controllers/scanController.js';
import { requireAuth } from '../middleware/auth.js';
import { handleImageUpload } from '../middleware/upload.js';

const router = express.Router();

// All scan endpoints require valid authentication
router.post('/detect', requireAuth, handleImageUpload, detectDisease);
router.get('/history', requireAuth, getScanHistory);
router.get('/:id', requireAuth, getScanById);
router.delete('/:id', requireAuth, deleteScan);

export default router;
