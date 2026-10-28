import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '../db/connection.js';
import { config } from '../config/index.js';

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validation
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanRole = role && typeof role === 'string' ? role.trim() : 'Field Agronomist';

    // 2. Check duplicate email
    const [existing] = await getPool().query('SELECT id FROM users WHERE email = ?', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    // 3. Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Insert into database
    const [result] = await getPool().query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [cleanName, cleanEmail, passwordHash, cleanRole]
    );

    const userId = result.insertId;

    // 5. Generate JWT token
    const token = jwt.sign(
      { userId, email: cleanEmail, role: cleanRole },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: userId,
        name: cleanName,
        email: cleanEmail,
        role: cleanRole
      }
    });
  } catch (err) {
    console.error('[Register Error]:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during registration.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Both email and password are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 1. Fetch user by email
    const [rows] = await getPool().query(
      'SELECT id, name, email, password_hash, role FROM users WHERE email = ?',
      [cleanEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    const user = rows[0];

    // 2. Compare password hash
    const isMatch = await bcrypt.compare(String(password), user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // 3. Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return res.status(200).json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('[Login Error]:', err);
    return res.status(500).json({ success: false, error: 'Internal server error during sign in.' });
  }
}

export async function getCurrentUser(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user
  });
}
