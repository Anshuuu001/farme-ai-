import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';
import { getPool } from '../src/db/connection.js';

test('Authentication API Suite', async (t) => {
  const app = createApp();
  const server = app.listen(0);
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const testUserEmail = `test_agronomist_${Date.now()}@farm.org`;
  let authToken = null;

  t.after(async () => {
    // Cleanup test user
    try {
      await getPool().query('DELETE FROM users WHERE email = ?', [testUserEmail]);
    } catch (_) {}
    server.close();
  });

  await t.test('1. Reject registration with invalid email', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Invalid User',
        email: 'invalid-email-format',
        password: 'validPassword123'
      })
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  await t.test('2. Reject registration with short password (<6 chars)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Short Pass User',
        email: 'short@farm.org',
        password: '123'
      })
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  await t.test('3. Register new agronomist successfully with bcrypt hash', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Dr. Test Agronomist',
        email: testUserEmail,
        password: 'securePassword123',
        role: 'Field Agronomist'
      })
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.token, 'Expected JWT token');
    assert.equal(data.user.email, testUserEmail);
    authToken = data.token;
  });

  await t.test('4. Reject duplicate email registration with 409 Conflict', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate User',
        email: testUserEmail,
        password: 'password123'
      })
    });
    assert.equal(res.status, 409);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  await t.test('5. Reject login with wrong password', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: 'wrongPasswordXYZ'
      })
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
  });

  await t.test('6. Login successfully with correct credentials', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: 'securePassword123'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(data.token);
  });

  await t.test('7. Access protected /api/auth/me with Bearer token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.user.email, testUserEmail);
  });

  await t.test('8. Reject /api/auth/me without token (401)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`);
    assert.equal(res.status, 401);
  });

  await t.test('9. Reject /api/auth/me with invalid signature (401)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: 'Bearer invalid.tampered.token' }
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /invalid/i);
  });

  await t.test('10. Reject /api/auth/me with expired token (401)', async () => {
    const jwt = (await import('jsonwebtoken')).default;
    const { config } = await import('../src/config/index.js');
    const expiredToken = jwt.sign({ userId: 'expired_user' }, config.jwt.secret, { expiresIn: -1 });

    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${expiredToken}` }
    });
    assert.equal(res.status, 401);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.match(data.error, /expired/i);
  });
});
