const { handleError } = require('../../middlewares/handleError');

const registerStatisticsRoutes = (router, { statistics }) => {
  router.get('/statistics', async (req, res) => {
    await handleError(req, res, async () => {
      req.logger.log('GET /statistics');
      const data = await statistics.getTrace();
      res.json(data);
    });
  });
};

module.exports = { registerStatisticsRoutes };
