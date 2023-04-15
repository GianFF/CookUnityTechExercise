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
   * updateQuery should be redefined by subclasess.
   * It's purpose is to create a query for each repository Update method.
   */
  // eslint-disable-next-line no-unused-vars
  updateQuery(element) {
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
   * insert inserts documents in the collection, making them fit the schema first.
   * @returns inserted documents
   */
  async insert(elements) {
    const collection = await this.collection();
    return collection.insertMany(this.transform(elements));
  }

  /**
   * update updates a document in the collection.
   */
  async update(element, updates) {
    const collection = await this.collection();
    return collection.updateOne(
      this.updateQuery(element),
      { $set: updates },
    );
  }

  /**
   * delete deletes all elements in a given collection.
   */
  async delete() {
    const collection = await this.collection();
    return collection.deleteMany();
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

  /**
   * mostTraced queries the collection to find the element with the biggest number of traces made.
   * @returns the most traced element in the collection
   */
  async mostTraced() {
    // NOTE - performamce: https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/#-sort----limit-coalescence

    const collection = await this.collection();
    return collection
      .find({}, { traced_times: 1, country: 1, _id: 0 })
      .sort({ traced_times: -1 })
      .limit(1)
      .toArray();
  }

  /**
   * longuestDistanceTraced queries the collection to find the farthest element to USA
   * @returns the element in the collection with the biggest distance from USA
   */
  async longuestDistanceTraced() {
    // NOTE - performamce: https://www.mongodb.com/docs/manual/core/aggregation-pipeline-optimization/#-sort----limit-coalescence

    const collection = await this.collection();
    return collection
      .find({}, { distance_to_usa: 1, country: 1, _id: 0 })
      .sort({ distance_to_usa: -1 })
      .limit(1)
      .toArray();
  }

  updateQuery(trace) {
    return { country: trace.country };
  }

  transform(traces) {
    let tracesArray = traces;
    if (!(traces instanceof Array)) {
      tracesArray = [traces];
    }
    return tracesArray.map((trace) => {
      const transformedTrace = {
        ...trace,
        country: trace.name,
        ip: [trace.ip],
        traced_times: 1,
      };
      delete transformedTrace.name;
      return transformedTrace;
    });
  }
}

/**
 * Used to mock MongoDB Collections while testing
 */
class InMemoryCollection {
  constructor() {
    this.inMemoryCollection = [];
  }

  async insertMany(elements) {
    this.inMemoryCollection.concat(elements);
    return Promise.resolve();
  }

  async updateOne() {
    return Promise.resolve();
  }

  async deleteMany() {
    this.inMemoryCollection = [];
    return Promise.resolve();
  }

  find() {
    return {
      project: () => ({
        toArray: async () => (Promise.resolve(this.inMemoryCollection)),
      }),
      sort: () => ({
        limit: () => ({
          toArray: async () => (Promise.resolve(this.inMemoryCollection)),
        }),
      }),
    };
  }

  async countDocuments() {
    return Promise.resolve(this.inMemoryCollection.length);
  }
}

class InMemoryTracesRepository extends TracesRepository {
  /**
   * Mocks a Mongo DB collection
   * @returns the collection for this.collectionName
   */
  async collection() {
    return Promise.resolve(new InMemoryCollection());
  }
}

module.exports = {
  tracesRepository: new TracesRepository(),
  inMemoryTracesRepository: new InMemoryTracesRepository(),
};
