const { CountriesDistances } = require('../../src/services/countriesDistances');

describe('Countries Distances Service', () => {
  let service;

  beforeEach(() => {
    service = new CountriesDistances();
  });

  const subject = async (lat, lon) => service.distanceToUSAFrom(lat, lon);

  it('Distance from USA to USA should be 0', async () => {
    const latitude = 39.000000;
    const longitude = -80.500000;

    const response = await subject(latitude, longitude);

    expect(response).toBe(0);
  });

  it('Distance from ARG to USA should be 8494.64', async () => {
    const latitude = -34.6022;
    const longitude = -58.3845;

    const response = await subject(latitude, longitude);

    expect(response).toBe(8494.64);
  });
});
