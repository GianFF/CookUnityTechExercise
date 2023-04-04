const request = require('supertest');
const { app } = require('../../src/app');

describe('Server', () => {
  test('accepts connections', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toBe(200);
  });
});
