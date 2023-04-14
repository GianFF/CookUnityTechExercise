const registerStatisticsRoutes = (router, { statistics }) => {
  router.get('/statistics', async (_, res) => {
    const data = await statistics.getTrace();
    res.json(data);
  });
};

module.exports = { registerStatisticsRoutes };
