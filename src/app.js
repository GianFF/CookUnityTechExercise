const express = require('express');
const bodyParser = require('body-parser');
const { initV1 } = require('./API/v1');
const { errorHandler } = require('./middlewares/errorHandler');
const { logger } = require('./middlewares/logger');
const { injectables } = require('./injectables');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(logger(injectables.loggerFactory));

app.use('/v1', initV1(injectables));

app.use(errorHandler);

module.exports = { app };
