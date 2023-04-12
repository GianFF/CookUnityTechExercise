const { HTTPError } = require('../../httpError');

const registerTracesRoutes = (router, injectables) => {
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
    const trace = await injectables.traces.traceIP(ip);
    res.json(trace);
  });
};

module.exports = { registerTracesRoutes };
