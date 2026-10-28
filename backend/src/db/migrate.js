import mysql from 'mysql2/promise';
import { config } from '../config/index.js';

export async function runMigrations() {
  console.log(`[Database Migration] Connecting to MySQL at ${config.db.host}:${config.db.port}...`);

  // Connect to MySQL server root (without selecting database initially)
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password
  });

  try {
    // 1. Create database if it doesn't exist
    console.log(`[Database Migration] Ensuring database '${config.db.database}' exists...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${config.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );

    await connection.changeUser({ database: config.db.database });

    // 2. Create users table
    console.log('[Database Migration] Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(180) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(60) NOT NULL DEFAULT 'Field Agronomist',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_users_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // 3. Create scans table
    console.log('[Database Migration] Creating scans table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS scans (
        id VARCHAR(64) PRIMARY KEY,
        user_id INT NOT NULL,
        image_name VARCHAR(255) NOT NULL,
        image_path VARCHAR(500) NULL,
        disease_key VARCHAR(64) NOT NULL,
        disease_name VARCHAR(120) NOT NULL,
        scientific_name VARCHAR(120) NOT NULL,
        severity VARCHAR(40) NOT NULL,
        confidence FLOAT NOT NULL,
        is_healthy BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_scans_user
          FOREIGN KEY (user_id) REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        INDEX idx_scans_user_created (user_id, created_at DESC),
        INDEX idx_scans_disease (disease_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('[Database Migration] ✅ All tables created successfully.');
    return { success: true };
  } catch (err) {
    console.error('[Database Migration] ❌ Migration failed:', err.message);
    throw err;
  } finally {
    await connection.end();
  }
}

// Run directly if invoked via CLI
if (process.argv[1]?.endsWith('migrate.js')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
