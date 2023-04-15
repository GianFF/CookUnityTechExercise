/* eslint-disable max-classes-per-file */
const axios = require('axios');
const { HTTPError } = require('../errors/httpError');

class IpData {
  constructor(apiKey) {
    this.IP_DATA_API = axios.create({
      baseURL: 'http://ip-api.com/json/',
      timeout: 1000,
      headers: { apiKey },
    });
  }

  /**
   * Calls the ip-api.com
   * @param {*} ip: the ip to ask about
   */
  async ipData(ip) {
    try {
      const response = await this.IP_DATA_API.get(`${ip}?fields=country,countryCode,lat,lon,currency`);
      return response.data;
    } catch (error) {
      throw new HTTPError(error.message || 'Error from ip-api.com', 400);
    }
  }
}

class MockIpData extends IpData {
  constructor(apiKey, fail = false) {
    super(apiKey);
    this.fail = fail;
  }

  /**
   * Mocks the calls to the ip-api.com and returns mock data
   */
  // eslint-disable-next-line class-methods-use-this
  async ipData() {
    if (this.fail) {
      return Promise.reject(
        new HTTPError('Error from ip-api.com', 400),
      );
    }
    return Promise.resolve({
      country: 'Argentina',
      countryCode: 'AR',
      lat: -34.7189,
      lon: -58.2604,
      currency: 'ARS',
    });
  }
}

module.exports = { IpData, MockIpData };
