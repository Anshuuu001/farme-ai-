import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'agrivision_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'agrivision_dev_secret_fallback_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  upload: {
    maxSizeBytes: 10 * 1024 * 1024, // 10 MB limit
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
  }
};
