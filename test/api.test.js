const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');

test('GET /api/health returns a healthy response', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.status, 'ok');
  } finally {
    server.close();
  }
});

test('POST /api/login accepts demo credentials', async () => {
  const server = app.listen(0);
  const address = await new Promise((resolve) => server.once('listening', () => resolve(server.address())));

  try {
    const response = await fetch(`http://127.0.0.1:${address.port}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gyaandaan.com', password: 'password123' })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(body.success, true);
    assert.equal(body.user.email, 'admin@gyaandaan.com');
  } finally {
    server.close();
  }
});
