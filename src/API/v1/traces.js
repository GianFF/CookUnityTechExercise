const { HTTPError } = require('../../errors/httpError');
const { handleError } = require('../../middlewares/handleError');

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
    await handleError(req, res, async () => {
      const { ip } = req.body;
      req.logger.log(`POST /traces --> ${ip}`);
      const trace = await traces.traceIP(ip);
      req.logger.log(`POST /traces --> ${ip} - response: ${JSON.stringify(trace)}`);
      res.json(trace);
    });
  });

  router.get('/traces', async (req, res) => {
    await handleError(req, res, async () => {
      req.logger.log('GET /traces');
      const result = await tracesRepository.findBy();
      res.json(result);
    });
  });

  router.delete('/traces', async (req, res) => {
    await handleError(req, res, async () => {
      req.logger.log('DELETE /traces');
      const result = await tracesRepository.delete();
      res.json(result);
    });
  });
};

module.exports = { registerTracesRoutes };
