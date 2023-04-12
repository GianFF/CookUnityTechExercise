const { HTTPError } = require('../httpError');

const errorHandler = (error, _, res, next) => {
  // console.error(error.stack);
  if (error instanceof HTTPError) {
    res.status(error.statusCode);
    res.json({
      errorMessage: error.message,
    });
  } else {
    next();
  }
};

module.exports = { errorHandler };
