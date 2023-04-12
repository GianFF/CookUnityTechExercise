const registerStatisticsRoutes = (router, injectables) => {
  router.get('/statistics', async (_, res) => {
    const statistics = await injectables.statistics.getTrace();
    res.json(statistics);
  });
};

module.exports = { registerStatisticsRoutes };
