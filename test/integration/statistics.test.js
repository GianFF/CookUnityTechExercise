/* eslint-disable global-require */
const request = require('supertest');

process.env.NODE_ENV = 'test';
const { app } = require('../../src/app');

describe('API', () => {
  describe('GET /v1/statistics', () => {
    let response;

    beforeAll(async () => {
      response = await request(app).get('/v1/statistics');
    });

    test('returns the longest distance from requested traces', async () => {
      expect(response.statusCode).toBe(200);
      const { body } = response;
      expect(body.longest_distance).toEqual({
        country: null,
        value: 0,
      });
    });

    test('returns the most traced country', async () => {
      expect(response.statusCode).toBe(200);
      const { body } = response;
      expect(body.most_traced).toEqual({
        country: null,
        value: 0,
      });
    });
  });
});
