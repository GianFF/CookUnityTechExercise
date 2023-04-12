const { traces } = require('../services/traces');
const { statistics } = require('../services/statistics');

const devInjectables = {
  traces,
  statistics,
};

const prodInjectables = {
  traces,
  statistics,
};

const injectables = {
  get: () => (process.env.NODE_ENV === 'production' ? prodInjectables : devInjectables),
};

module.exports = { injectables };
