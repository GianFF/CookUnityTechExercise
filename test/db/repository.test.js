/* eslint-disable no-underscore-dangle */
const traceSample = require('../samples/trace.json');
const { tracesRepository } = require('../../src/db/repositories');

describe('Repositories', () => {
  describe('transform', () => {
    describe('Returns a trace with the expected DB schema', () => {
      test('TracesRepository', () => {
        const [transformedTrace] = tracesRepository.transform([traceSample]);

        const expected = {
          ...traceSample,
          country: traceSample.name,
          ip: [traceSample.ip],
          traced_times: 1,
        };
        delete expected.name;

        expect(transformedTrace).toEqual(expected);
      });
    });
  });
});
