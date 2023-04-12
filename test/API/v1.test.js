/* eslint-disable global-require */
const request = require('supertest');
const { restoreMocks } = require('../restore-mocks');
const traceJSON = require('../samples/trace.json');
const statistics = require('../samples/statistics.json');

describe('API', () => {
  let app;

  beforeEach(() => {
    restoreMocks();
    const { injectables } = require('../../src/injectables');
    jest.spyOn(injectables, 'get').mockImplementation(() => ({
      traces: {
        traceIP: async () => Promise.resolve(traceJSON),
      },
      statistics: {
        get: async () => Promise.resolve(statistics),
      },
    }));
    app = require('../../src/app').app;
  });

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

    describe('When success returns the all the information about that IP', () => {
      test('including the IP', async () => {
        const response = await request(app).post('/v1/traces').send({ ip: '190.191.237.90' });

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.ip).toBe('190.191.237.90');
      });

      test('including the country which issued the IP and its ISO code', async () => {
        const response = await request(app).post('/v1/traces').send({ ip: '190.191.237.90' });

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.name).toBe('Argentina');
        expect(body.code).toBe('AR');
      });

      test('including the coordinates for its location (latitude and longitude)', async () => {
        const response = await request(app).post('/v1/traces').send({ ip: '190.191.237.90' });

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.lat).toBe(-34.6022);
        expect(body.lon).toBe(-58.3845);

        // An array of currencies for that country with:
        expect(body.currencies).toEqual([
          {
            iso: 'ARS', // ISO code (USD, CAD, ARS)
            symbol: '$', // Symbol ($, £)
            conversion_rate: 0.023, // Conversion rate from currency to USD
          },
          {
            iso: 'USD', // ISO code (USD, CAD, ARS)
            symbol: '$', // Symbol ($, £)
            conversion_rate: 1, // Conversion rate from currency to USD
          },
        ]);

        // Distance between United States and country of origin (in Kilometers)
        expect(body.distance_to_usa).toBe(8395.28);
      });

      test('including an array of currencies for that country', async () => {
        const response = await request(app).post('/v1/traces').send({ ip: '190.191.237.90' });

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.currencies).toEqual([
          {
            iso: 'ARS', // ISO code (USD, CAD, ARS)
            symbol: '$', // Symbol ($, £)
            conversion_rate: 0.023, // Conversion rate from currency to USD
          },
          {
            iso: 'USD', // ISO code (USD, CAD, ARS)
            symbol: '$', // Symbol ($, £)
            conversion_rate: 1, // Conversion rate from currency to USD
          },
        ]);
      });

      test('including the distance between United States and country of origin (in Kilometers)', async () => {
        const response = await request(app).post('/v1/traces').send({ ip: '190.191.237.90' });

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.distance_to_usa).toBe(8395.28);
      });
    });
  });

  describe('GET /v1/statistics', () => {
    // describe('When no trace was made', () => {
    //   test('returns the longest distance from requested traces', async () => {
    //     const response = await request(app).get('/v1/statistics');
    //
    //     expect(response.statusCode).toBe(200);
    //     const { body } = response;
    //     expect(body.longest_distance).toEqual({
    //       country: null,
    //       value: 0,
    //     });
    //   });
    //
    //   test('returns the most traced country', async () => {
    //     const response = await request(app).get('/v1/statistics');
    //
    //     expect(response.statusCode).toBe(200);
    //     const { body } = response;
    //     expect(body.most_traced).toEqual({
    //       country: null,
    //       value: 0,
    //     });
    //   });
    // });

    describe('When at least one trace was made', () => {
      test('returns the longest distance from requested traces', async () => {
        const response = await request(app).get('/v1/statistics');

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.longest_distance).toEqual({
          country: 'United States',
          value: 0,
        });
      });

      test('returns the most traced country', async () => {
        const response = await request(app).get('/v1/statistics');

        expect(response.statusCode).toBe(200);
        const { body } = response;
        expect(body.most_traced).toEqual({
          country: 'United States',
          value: 1,
        });
      });
    });
  });
});
