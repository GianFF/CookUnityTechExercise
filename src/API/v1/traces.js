const { HTTPError } = require('../../httpError');

const registerTracesRoutes = (router, { traces, tracesRepository }) => {
  const validateIP = (req, _, next) => {
    const { ip } = req.body;
    if (!ip) {
      throw new HTTPError('No IP was sent', 400);
    }
    if (ip.split('.').length < 4) {
      throw new HTTPError('Mal Formed IP', 400);
    }
    next();
  };

  router.post('/traces', [validateIP], async (req, res) => {
    const { ip } = req.body;
    const trace = await traces.traceIP(ip);
    res.json(trace);
  });

  router.get('/traces', async (req, res) => {
    const result = await tracesRepository.findBy();
    res.json(result);
  });

  router.delete('/traces', async (req, res) => {
    const result = await tracesRepository.delete();
    res.json(result);
  });
};

module.exports = { registerTracesRoutes };
