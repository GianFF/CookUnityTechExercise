const { Traces } = require('../services/traces');
const { Statistics } = require('../services/statistics');
const { CountriesDistances } = require('../services/countriesDistances');
const { Exchange } = require('../services/exchange');
const { IpData } = require('../services/ipData');
const { tracesRepository } = require('../db/repositories');
const { API_LAYER_EXCHANGE_API_KEY } = require('../config');

// TODO: create an ExchangeService for Test that returns following object
// return Promise.resolve({
//   info: {
//     rate: 0.004689,
//   },
// });

// TODO: create an IpDataService for Test that returns following object
// return Promise.resolve({{
//   country: "Argentina",
//   countryCode: "AR",
//   lat: -34.7189,
//   lon: -58.2604,
//   currency: "ARS"
// });

const injectables = {
  get: () => {
    const statistics = new Statistics({ tracesRepository });
    const countriesDistances = new CountriesDistances();
    const ipData = new IpData('prodToken');
    const exchange = new Exchange(API_LAYER_EXCHANGE_API_KEY);
    const traces = new Traces({
      statistics,
      ipData,
      countriesDistances,
      exchange,
    });

    return {
      traces,
      statistics,
      countriesDistances,
      tracesRepository,
    };
  },
};

module.exports = { injectables };
