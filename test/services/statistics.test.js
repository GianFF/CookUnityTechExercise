const { restoreMocks } = require('../restore-mocks');
const { Statistics } = require('../../src/services/statistics');

describe('Statistics Service', () => {
  let statisticsService;
  let longuestDistance;
  let mostTraced;

  beforeEach(() => {
    restoreMocks();
    longuestDistance = {
      country: 'USA',
      distance_to_usa: 0,
    };
    mostTraced = {
      country: 'USA',
      traced_times: 1,
    };
    statisticsService = new Statistics({
      tracesRepository: {
        mostTraced: jest.fn(() => Promise.resolve(mostTraced)),
        longuestDistanceTraced: jest.fn(() => Promise.resolve(longuestDistance)),
      },
    });
  });

  const subject = async () => statisticsService.getTrace();

  it('calls the repository to retrieve most traced country', async () => {
    await subject();

    expect(statisticsService.tracesRepository.mostTraced).toHaveBeenCalledTimes(1);
  });

  it('calls the repository to retrieve the country with Longest distance from requested traces', async () => {
    await subject();

    expect(statisticsService.tracesRepository.longuestDistanceTraced).toHaveBeenCalledTimes(1);
  });

  it('returns an object with the mostr traced country and the longuest distance to USA', async () => {
    const res = await subject();

    expect(res).toEqual({
      longest_distance: {
        country: longuestDistance.country,
        value: longuestDistance.distance_to_usa,
      },
      most_traced: {
        country: mostTraced.country,
        value: mostTraced.traced_times,
      },
    });
  });
});
