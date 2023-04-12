class Statistics {
  constructor({ tracesRepository }) {
    this.tracesRepository = tracesRepository;
  }

  /**
   * Returns information about traces made.
   * @returns an object containg longest_distance and most_traced country.
   */
  async getTrace() {
    const mostTraced = await this.tracesRepository.mostTraced();
    const longuestDistance = await this.tracesRepository.longuestDistanceTraced();

    return {
      longest_distance: {
        country: longuestDistance.country,
        value: longuestDistance.distance_to_usa,
      },
      most_traced: {
        country: mostTraced.country,
        value: mostTraced.traced_times,
      },
    };
  }

  /**
   * Inserts a trace made in the DB.
   */
  async addTrace(trace) {
    const traced = await this.tracesRepository.findBy({ country: trace.name });
    if (!traced) {
      await this.tracesRepository.insert(trace);
    } else {
      await this.tracesRepository.update(trace, {
        traced_times: trace.tracedTimes + 1,
        ip: [...trace.ip, trace.ip],
      });
    }
  }
}

module.exports = { Statistics };
