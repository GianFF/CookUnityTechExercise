const { MongoClient } = require('mongodb');
const { MONGO_CONNECTION_STRING, MONGO_CONNECTION_TIMEOUT } = require('../../config');

const mongoClient = {
  client: null,
  /**
   * newMongoClient takes care of initializing a mongo client.
   *
   * It shouldn't be used by others outside this module.
   * @returns an instance of a MongoClient
   */
  newMongoClient() {
    return new MongoClient(
      MONGO_CONNECTION_STRING,
      { connectTimeoutMS: MONGO_CONNECTION_TIMEOUT },
    );
  },
  /**
   * get initializes a new DB connection pool.
   * @returns an instance of a MongoClient connected to the data base.
   */
  async get() {
    if (!this.client) {
      this.client = this.newMongoClient();
      await this.client.connect();
    }
    return this.client;
  },
  /**
   * close closes the created DB connection pool.
   */
  async close() {
    if (!this.client) {
      return;
    }
    await this.client.close();
    this.client = null;
  },
};

module.exports = { mongoClient };
