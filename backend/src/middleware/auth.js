import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { getPool } from '../db/connection.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Missing or malformed Bearer token.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Session expired. Please sign in again.' });
      }
      return res.status(401).json({ success: false, error: 'Invalid authentication token.' });
    }

    const [rows] = await getPool().query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'User account no longer exists.' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    console.error('[Auth Middleware Error]:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during authentication.' });
  }
}
