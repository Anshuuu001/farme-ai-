import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import scanRoutes from './routes/scanRoutes.js';
import { testConnection } from './db/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp() {
  const app = express();

  // Middleware
  app.use(cors({
    origin: '*', // Allow frontend development servers
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Static uploads directory for authenticated inspection thumbnail retrieval
  app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

  // Health-check endpoint
  app.get('/api/health', async (req, res) => {
    const dbStatus = await testConnection();
    res.status(200).json({
      status: 'online',
      service: 'AgriVision AI Backend API',
      database: dbStatus.ok ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  });

  // REST API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/scans', scanRoutes);

  // 404 Fallback
  app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found.' });
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error('[Global Error Handler]:', err);
    res.status(500).json({
      success: false,
      error: 'An unexpected internal server error occurred.'
    });
  });

  return app;
}
