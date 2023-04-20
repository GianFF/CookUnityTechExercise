require('dotenv').config();

module.exports = {
  MONGO_DATABASE_NAME: process.env.MONGO_DATABASE_NAME,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_CONNECTION_STRING: process.env.MONGO_CONNECTION_STRING,
  MONGO_CONNECTION_TIMEOUT: process.env.MONGO_CONNECTION_TIMEOUT,
  API_LAYER_EXCHANGE_API_KEY: process.env.API_LAYER_EXCHANGE_API_KEY,
  API_LAYER_EXCHANGE_API_KEY_DEV: process.env.API_LAYER_EXCHANGE_API_KEY_DEV,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
};
