const { HTTPError } = require('../errors/httpError');

const handleError = async (req, res, next) => {
  try {
    await next();
  } catch (error) {
    if (error instanceof HTTPError) {
      req.logger.log(`Status code: ${error.statusCode} - ${error.stack}`);
      res.status(error.statusCode);
      res.json({
        errorMessage: error.message,
      });
    } else {
      req.logger.log('Unexpected error occurred');
      res.status(500);
      res.json({
        errorMessage: 'Server error',
      });
    }
  }
};

module.exports = { handleError };
