import mysql from 'mysql2/promise';
import { config } from '../config/index.js';

let pool = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: config.db.waitForConnections,
      connectionLimit: config.db.connectionLimit,
      queueLimit: config.db.queueLimit,
      enableKeepAlive: config.db.enableKeepAlive,
      keepAliveInitialDelay: config.db.keepAliveInitialDelay
    });
  }
  return pool;
}

export async function testConnection() {
  try {
    const connection = await getPool().getConnection();
    await connection.ping();
    connection.release();
    return { ok: true, message: 'MySQL connection established successfully.' };
  } catch (err) {
    return { ok: false, error: err.message, code: err.code };
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
