const express = require('express');
const { registerTracesRoutes } = require('./traces');
const { registerStatisticsRoutes } = require('./statistics');

const initV1 = (injectables) => {
  const router = express.Router();
  router.get('/', (req, res) => {
    res.send(`v1 route includes:\n
      - POST /traces.\n
      - GET /statistics
    `);
  });

  registerTracesRoutes(router, injectables);
  registerStatisticsRoutes(router, injectables);

  return router;
};

module.exports = { initV1 };
