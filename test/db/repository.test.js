/* eslint-disable no-underscore-dangle */
const traceSample = require('../samples/trace.json');
const { tracesRepository } = require('../../src/db/repositories');

describe('Repositories', () => {
  describe('transform', () => {
    describe('Returns a trace with the expected DB schema', () => {
      test('TracesRepository', () => {
        const [trace] = tracesRepository.transform([traceSample]);

        expect(trace).toEqual({});
      });
    });
  });
});
