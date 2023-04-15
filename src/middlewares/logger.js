const logger = (loggerFactory) => (req, _, next) => {
  req.transactionID = new Date().valueOf();
  req.logger = loggerFactory.newLogger(req.transactionID);
  next();
};

module.exports = { logger };
