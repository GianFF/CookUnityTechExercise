const { Traces } = require('../services/traces');
const { Statistics } = require('../services/statistics');
const { CountriesDistances } = require('../services/countriesDistances');
const { Exchange, MockExchange } = require('../services/exchange');
const { IpData, MockIpData } = require('../services/ipData');
const { newLogger } = require('../logger');
const { tracesRepository, inMemoryTracesRepository } = require('../db/repositories');
const { API_LAYER_EXCHANGE_API_KEY } = require('../config');
const { NODE_ENV } = require('../config');

const prodInjectables = () => {
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
    loggerFactory: { newLogger },
  };
};

const devInjectables = () => {
  const statistics = new Statistics({ tracesRepository });
  const countriesDistances = new CountriesDistances();
  const ipData = new MockIpData();
  const exchange = new MockExchange(API_LAYER_EXCHANGE_API_KEY);
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
    loggerFactory: { newLogger },
  };
};

const testInjectables = () => {
  const statistics = new Statistics({ tracesRepository: inMemoryTracesRepository });
  const countriesDistances = new CountriesDistances();
  const ipData = new MockIpData();
  const exchange = new MockExchange(API_LAYER_EXCHANGE_API_KEY);
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
    tracesRepository: inMemoryTracesRepository,
    loggerFactory: { newLogger: () => ({ log: () => {} }) },
  };
};

const injectables = () => {
  if (NODE_ENV === 'production') {
    return prodInjectables();
  }
  if (NODE_ENV === 'development') {
    return devInjectables();
  }
  return testInjectables();
};

module.exports = { injectables: injectables() };
