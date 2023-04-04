const { restoreMocks } = require('../restore-mocks');
const { mongoClient } = require('../../src/db/mongoClient');

describe('Mongo Client', () => {
  let newMongoClientSpy;

  beforeEach(() => {
    restoreMocks();

    newMongoClientSpy = jest.spyOn(mongoClient, 'newMongoClient').mockImplementation(() => ({
      connect: jest.fn(),
      close: jest.fn(),
    }));
  });

  afterEach(async () => {
    await mongoClient.close();
  });

  describe('connect', () => {
    test('if it was not connected then the client is null', () => {
      expect(newMongoClientSpy).toHaveBeenCalledTimes(0);
      expect(mongoClient.client).toBeNull();
    });

    test('after it is connected, is not null anymore', async () => {
      await mongoClient.get();

      expect(newMongoClientSpy).toHaveBeenCalledTimes(1);
      expect(mongoClient.client).not.toBeNull();
    });

    test('it can be connected only one time', async () => {
      await mongoClient.get();
      await mongoClient.get();

      expect(newMongoClientSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('close', () => {
    test('after closing it, the client will be null', async () => {
      await mongoClient.get();

      await mongoClient.close();

      expect(mongoClient.client).toBeNull();
    });

    test('if the client was not connected, closing it does nothing', async () => {
      await (expect(() => mongoClient.close())).not.toThrow();
    });
  });
});
