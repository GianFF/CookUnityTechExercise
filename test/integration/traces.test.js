/* eslint-disable global-require */
const request = require('supertest');

process.env.NODE_ENV = 'test';
const { app } = require('../../src/app');

describe('API', () => {
  describe('POST /v1/traces', () => {
    describe('When the body does not contains an IP param', () => {
      test('returns status 400 with an error message', async () => {
        const response = await request(app).post('/v1/traces');

        expect(response.statusCode).toBe(400);
        expect(response.body.errorMessage).toBe('No IP was sent');
      });
    });

    describe('When the IP param in the body is not well formed', () => {
      test('returns status 400 with an error message', async () => {
        const response = await request(app).post('/v1/traces').send({ ip: '0.0.0' });

        expect(response.statusCode).toBe(400);
        expect(response.body.errorMessage).toBe('Mal Formed IP');
      });
    });

    describe('When success returns all the information about that IP', () => {
      let response;

      beforeAll(async () => {
        response = await request(app).post('/v1/traces').send({ ip: '190.191.237.90' });
      });

      test('including the IP', async () => {
        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.ip).toBe('190.191.237.90');
      });

      test('including the country which issued the IP and its ISO code', async () => {
        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.name).toBe('Argentina');
        expect(body.code).toBe('AR');
      });

      test('including the coordinates for its location (latitude and longitude)', async () => {
        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.lat).toBe(-34.7189);
        expect(body.lon).toBe(-58.2604);

        // An array of currencies for that country with:
        expect(body.currencies).toEqual([
          {
            iso: 'ARS', // ISO code (USD, CAD, ARS)
            symbol: '$', // Symbol ($, £)
            conversion_rate: 0.004689, // Conversion rate from currency to USD
          },
          {
            iso: 'USD', // ISO code (USD, CAD, ARS)
            symbol: '$', // Symbol ($, £)
            conversion_rate: 1, // Conversion rate from currency to USD
          },
        ]);

        // Distance between United States and country of origin (in Kilometers)
        expect(body.distance_to_usa).toBe(8510.44);
      });

      test('including an array of currencies for that country', async () => {
        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.currencies).toEqual([
          {
            iso: 'ARS', // ISO code (USD, CAD, ARS)
            symbol: '$', // Symbol ($, £)
            conversion_rate: 0.004689, // Conversion rate from currency to USD
          },
          {
            iso: 'USD', // ISO code (USD, CAD, ARS)
            symbol: '$', // Symbol ($, £)
            conversion_rate: 1, // Conversion rate from currency to USD
          },
        ]);
      });

      test('including the distance between United States and country of origin (in Kilometers)', async () => {
        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.distance_to_usa).toBe(8510.44);
      });
    });
  });
});
