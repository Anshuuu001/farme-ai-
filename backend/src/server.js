import { createApp } from './app.js';
import { config } from './config/index.js';
import { testConnection } from './db/connection.js';
import { initInferenceSession } from './services/inferenceService.js';

async function bootstrap() {
  console.log('--------------------------------------------------');
  console.log('🌿 Starting AgriVision AI Backend Service...');
  console.log(`🌿 Environment: ${config.nodeEnv}`);
  console.log('--------------------------------------------------');

  // 1. Verify MySQL connection
  const dbStatus = await testConnection();
  if (dbStatus.ok) {
    console.log('[Database] ✅ Connected to MySQL database:', config.db.database);
  } else {
    console.warn('[Database] ⚠️ MySQL connection check failed:', dbStatus.error);
    console.warn('[Database] Ensure MySQL server is running and credentials in .env are correct.');
  }

  // 2. Preload MobileNetV2 ONNX model
  try {
    await initInferenceSession();
  } catch (modelErr) {
    console.error('[AI Engine] ❌ Failed to preload ONNX model:', modelErr.message);
  }

  // 3. Start HTTP server
  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`[HTTP Server] 🚀 AgriVision AI API listening at http://localhost:${config.port}`);
    console.log(`[HTTP Server] Health check available at http://localhost:${config.port}/api/health`);
    console.log('--------------------------------------------------');
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\n[Server] Shutting down gracefully...');
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch(err => {
  console.error('[Fatal Bootstrap Error]:', err);
  process.exit(1);
});
