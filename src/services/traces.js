class Traces {
  constructor({
    ipData, countriesDistances, exchange, statistics,
  }) {
    this.distancesService = countriesDistances;
    this.exchangeService = exchange;
    this.ipDataService = ipData;
    this.statisticsService = statistics;
  }

  /**
   * Returns information about given IP.
   * @param {*} ip: the IP which information is being asked.
   * @returns an object containg information about the IP country, exchange rate with USA,
   *  and distance to USA.
   */
  async traceIP(ip) {
    const {
      countryCode, lat, lon, currency, country,
    } = await this.ipDataService.ipData(ip);
    const currencyInfo = await this.exchangeService.currencyExchangeData(currency);
    const distanceToUSA = this.distancesService.distanceToUSAFrom(lat, lon);
    const trace = {
      ip,
      name: country,
      code: countryCode,
      lat,
      lon,
      currencies: [
        {
          iso: currency,
          symbol: '$',
          conversion_rate: currencyInfo.info.rate,
        },
        {
          iso: 'USD',
          symbol: '$',
          conversion_rate: 1,
        },
      ],
      distance_to_usa: distanceToUSA,
    };
    // NOTE: Avoiding await. This should be easily move to another microservice
    this.statisticsService.addTrace(trace);
    return trace;
  }
}

module.exports = { Traces };
