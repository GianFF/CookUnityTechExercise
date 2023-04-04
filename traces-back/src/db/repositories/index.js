/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
const { MONGO_DATABASE_NAME } = require('../../config');
const { mongoClient } = require('../mongoClient');

class Repository {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  /**
   * transform should be redefined by subclasess.
   * It's purpose is to match objects to it's collection schema.
   */
  // eslint-disable-next-line no-unused-vars
  transform(objects) {
    throw Error('Subclass responsibility');
  }

  /**
   * collection connects to the data base and gets the collection with name this.collectionName
   * @returns the collection for this.collectionName
   */
  async collection() {
    const client = await mongoClient.get();
    const db = client.db(MONGO_DATABASE_NAME);
    return db.collection(this.collectionName);
  }

  /**
   * insert inserts a document in the collection, making it fit the schema first.
   * @returns inserted documents
   */
  async insert(elements) {
    const collection = await this.collection();
    return collection.insertMany(this.transform(elements));
  }

  /**
   * findBy queries documents in the collection.
   * If no query is given then all documents will be returned.
  * @param {*} query the query to execute. Should match the collection schema.
  * @param {*} projection elements to return.
  * @returns found documents
   */
  async findBy(query, projection) {
    const collection = await this.collection();
    return collection.find(query).project(projection).toArray();
  }

  /**
   * count counts the documents in the collection
   * @returns the number of documents in the collection
   */
  async count() {
    const collection = await this.collection();
    return collection.countDocuments();
  }
}

class TracesRepository extends Repository {
  constructor() {
    super('traces');
  }

  transform(traces) {
    return traces.map((trace) => ({}));
  }
}

module.exports = {
  tracesRepository: new TracesRepository(),
};
