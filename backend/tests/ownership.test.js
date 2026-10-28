import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from '../src/app.js';
import { getPool } from '../src/db/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Scan History & SQL Ownership Enforcement Suite', async (t) => {
  const app = createApp();
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const emailA = `farmer_a_${Date.now()}@farm.org`;
  const emailB = `farmer_b_${Date.now()}@farm.org`;
  let tokenA = null;
  let tokenB = null;
  let userAScanId = null;

  t.before(async () => {
    // 1. Register User A
    const resA = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Farmer A', email: emailA, password: 'password123' })
    });
    const dataA = await resA.json();
    tokenA = dataA.token;

    // 2. Register User B
    const resB = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Farmer B', email: emailB, password: 'password123' })
    });
    const dataB = await resB.json();
    tokenB = dataB.token;

    // 3. User A uploads a scan
    const samplePath = path.resolve(__dirname, '../../frontend/public/images/tomato_healthy.jpg');
    const fileBuffer = fs.readFileSync(samplePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, 'sample_healthy.jpg');

    const scanRes = await fetch(`${baseUrl}/api/scans/detect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
      body: formData
    });
    const scanData = await scanRes.json();
    userAScanId = scanData.scanId;
  });

  t.after(async () => {
    try {
      await getPool().query('DELETE FROM users WHERE email IN (?, ?)', [emailA, emailB]);
    } catch (_) {}
    server.close();
  });

  await t.test('1. User A can retrieve their own scan in history', async () => {
    const res = await fetch(`${baseUrl}/api/scans/history`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.count, 1);
    assert.equal(data.scans[0].id, userAScanId);
  });

  await t.test('2. User B CANNOT see User A’s scan in history (SQL isolation)', async () => {
    const res = await fetch(`${baseUrl}/api/scans/history`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.count, 0, 'User B should see 0 scans');
    assert.equal(data.scans.length, 0);
  });

  await t.test('3. User B CANNOT delete User A’s scan (Strict ownership check)', async () => {
    const res = await fetch(`${baseUrl}/api/scans/${userAScanId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.equal(res.status, 404, 'Must return 404 unauthorized to delete');
    const data = await res.json();
    assert.equal(data.success, false);

    // Verify scan still exists in database
    const [rows] = await getPool().query('SELECT id FROM scans WHERE id = ?', [userAScanId]);
    assert.equal(rows.length, 1, 'Scan must still exist in database');
  });

  await t.test('4. User A CAN retrieve their scan detail by ID with agronomic guidance', async () => {
    const res = await fetch(`${baseUrl}/api/scans/${userAScanId}`, {
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.scan.id, userAScanId);
    assert.ok(data.scan.solutions, 'Scan must include agronomic solutions');
    assert.ok(Array.isArray(data.scan.symptoms), 'Scan must include symptoms array');
  });

  await t.test('5. User B CANNOT retrieve User A’s scan detail by ID (SQL isolation)', async () => {
    const res = await fetch(`${baseUrl}/api/scans/${userAScanId}`, {
      headers: { Authorization: `Bearer ${tokenB}` }
    });
    assert.equal(res.status, 404, 'Must return 404 unauthorized to view');
    const data = await res.json();
    assert.equal(data.success, false);
  });

  await t.test('6. User A CAN delete their own scan successfully', async () => {
    const res = await fetch(`${baseUrl}/api/scans/${userAScanId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.deletedScanId, userAScanId);

    // Verify scan was removed from database
    const [rows] = await getPool().query('SELECT id FROM scans WHERE id = ?', [userAScanId]);
    assert.equal(rows.length, 0, 'Scan must be completely deleted');
  });
});
