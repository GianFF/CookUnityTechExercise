const registerStatisticsRoutes = (router, injectables) => {
  router.get('/statistics', async (_, res) => {
    const statistics = await injectables.statistics.get();
    res.json(statistics);
  });
};

module.exports = { registerStatisticsRoutes };
