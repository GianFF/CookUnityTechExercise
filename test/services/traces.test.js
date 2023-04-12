const { restoreMocks } = require('../restore-mocks');
const exchange = require('../samples/exchange.json');
const ipData = require('../samples/ipData.json');
const { Traces } = require('../../src/services/traces');

describe('Traces Service', () => {
  let tracesService;
  const IP = '186.57.202.133';
  const DISTANCE_FROM_ARG_TO_USA = 8395.28;

  beforeEach(() => {
    restoreMocks();
    tracesService = new Traces({
      ipData: {
        ipData: jest.fn(() => Promise.resolve(ipData)),
      },
      countriesDistances: {
        distanceToUSAFrom: jest.fn(() => DISTANCE_FROM_ARG_TO_USA),
      },
      exchange: {
        currencyExchangeData: jest.fn(() => Promise.resolve(exchange)),
      },
      statistics: {
        addTrace: jest.fn(),
      },
    });
  });

  const subject = async () => tracesService.traceIP(IP);

  it('calls the IP Data Service to retrieve the IP data', async () => {
    await subject();

    expect(tracesService.ipDataService.ipData).toHaveBeenCalledTimes(1);
  });

  it('calls the Exchange Service to calculate the conversion rate from that country currency to USD', async () => {
    await subject();

    expect(tracesService.exchangeService.currencyExchangeData).toHaveBeenCalledTimes(1);
  });

  it('calls Countries Distances Service to calculate the distance from that country to USA', async () => {
    await subject();

    expect(tracesService.distancesService.distanceToUSAFrom).toHaveBeenCalledTimes(1);
  });

  it('calls Statistics Service to add the new trace', async () => {
    await subject();

    expect(tracesService.statisticsService.addTrace).toHaveBeenCalledTimes(1);
  });

  it('returns traced IP', async () => {
    const trace = await subject();

    expect(trace).toEqual({
      ip: IP,
      name: ipData.country,
      code: ipData.countryCode,
      lat: ipData.lat,
      lon: ipData.lon,
      currencies: [
        {
          iso: ipData.currency,
          symbol: '$',
          conversion_rate: exchange.result,
        },
        {
          iso: 'USD',
          symbol: '$',
          conversion_rate: 1,
        },
      ],
      distance_to_usa: DISTANCE_FROM_ARG_TO_USA,
    });
  });
});
