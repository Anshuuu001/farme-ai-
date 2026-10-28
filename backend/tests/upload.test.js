import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from '../src/app.js';
import { getPool } from '../src/db/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Image Upload & Validation Suite', async (t) => {
  const app = createApp();
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const testEmail = `upload_tester_${Date.now()}@farm.org`;
  let token = null;

  t.before(async () => {
    // Register test user
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Upload Tester',
        email: testEmail,
        password: 'password123'
      })
    });
    const data = await regRes.json();
    token = data.token;
  });

  t.after(async () => {
    try {
      await getPool().query('DELETE FROM users WHERE email = ?', [testEmail]);
    } catch (_) {}
    server.close();
  });

  await t.test('1. Reject /api/scans/detect without authentication (401)', async () => {
    const res = await fetch(`${baseUrl}/api/scans/detect`, {
      method: 'POST'
    });
    assert.equal(res.status, 401);
  });

  await t.test('2. Reject scan request with missing image field (400)', async () => {
    const formData = new FormData();
    formData.append('note', 'no image attached');

    const res = await fetch(`${baseUrl}/api/scans/detect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  await t.test('3. Reject fake image with spoofed extension (magic byte verification)', async () => {
    // Create a plain text buffer claiming to be an image
    const fakeImageBuffer = Buffer.from('This is a plain text file, not a real JPEG image!');
    const blob = new Blob([fakeImageBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, 'fake_leaf.jpg');

    const res = await fetch(`${baseUrl}/api/scans/detect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /validation failed|invalid/i);
  });

  await t.test('4. Process genuine tomato leaf specimen and execute inference', async () => {
    const samplePath = path.resolve(__dirname, '../../frontend/public/images/tomato_early_blight.jpg');
    assert.ok(fs.existsSync(samplePath), 'Sample test leaf must exist');

    const fileBuffer = fs.readFileSync(samplePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, 'tomato_early_blight.jpg');

    const res = await fetch(`${baseUrl}/api/scans/detect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.scanId, 'Scan ID must be returned');
    assert.ok(data.result.displayName, 'Predicted condition must be present');
    assert.ok(typeof data.result.confidence === 'number', 'Confidence must be a number');
    assert.ok(Array.isArray(data.result.symptoms), 'Symptoms list must be an array');
    assert.ok(data.result.solutions.cultural, 'Cultural solutions must be provided');
    assert.ok(data.result.disclaimer, 'Safety disclaimer must be present');
  });

  await t.test('5. Reject file exceeding 10 MB limit (400)', async () => {
    // 10.5 MB oversized buffer
    const largeBuffer = Buffer.alloc(10.5 * 1024 * 1024, 0xff);
    const blob = new Blob([largeBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, 'oversized.jpg');

    const res = await fetch(`${baseUrl}/api/scans/detect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /exceeds maximum permitted limit/i);
  });

  await t.test('6. Process healthy tomato leaf specimen', async () => {
    const samplePath = path.resolve(__dirname, '../../frontend/public/images/tomato_healthy.jpg');
    assert.ok(fs.existsSync(samplePath), 'Healthy sample test leaf must exist');

    const fileBuffer = fs.readFileSync(samplePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, 'tomato_healthy.jpg');

    const res = await fetch(`${baseUrl}/api/scans/detect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.result.displayName, 'Predicted condition must be present');
    assert.ok(typeof data.result.confidence === 'number');
  });

  await t.test('7. Safeguard against unsupported crop / non-tomato specimen (returns Inconclusive)', async () => {
    // Generate a valid JPEG image of non-tomato / non-target pattern (dark square)
    const sharp = (await import('sharp')).default;
    const darkBuffer = await sharp({
      create: { width: 224, height: 224, channels: 3, background: { r: 35, g: 35, b: 35 } }
    }).jpeg().toBuffer();

    const blob = new Blob([darkBuffer], { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('image', blob, 'non_tomato_leaf.jpg');

    const res = await fetch(`${baseUrl}/api/scans/detect`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    // Verified safeguard: must not claim a tomato disease diagnosis
    assert.equal(data.result.isTomatoClass, false);
    assert.equal(data.result.isLowConfidence, true);
    assert.match(data.result.severity, /Inconclusive|Unsupported/i);
    assert.match(data.result.summary, /AgriVision AI V1 provides agronomic guidance exclusively for tomato/i);
  });
});
