const { Traces } = require('../services/traces');
const { Statistics } = require('../services/statistics');
const { CountriesDistances } = require('../services/countriesDistances');
const { Exchange } = require('../services/exchange');
const { IpData } = require('../services/ipData');
const { tracesRepository } = require('../db/repositories');

const devInjectables = () => {
  const statistics = new Statistics(tracesRepository);
  const countriesDistances = new CountriesDistances();
  const ipData = new IpData('devToken');
  const exchange = new Exchange('devToken');
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
};

const prodInjectables = () => {
  const statistics = new Statistics(tracesRepository);
  const countriesDistances = new CountriesDistances();
  const ipData = new IpData('prodToken');
  const exchange = new Exchange('prodToken');
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
};

const injectables = {
  get: () => (process.env.NODE_ENV === 'production' ? prodInjectables() : devInjectables()),
};

module.exports = { injectables };
