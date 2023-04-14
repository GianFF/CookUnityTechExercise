const axios = require('axios');

class IpData {
  constructor(ipAPIToken) {
    this.IP_DATA_API = axios.create({
      baseURL: 'http://ip-api.com/json/',
      timeout: 1000,
      headers: { apiKey: ipAPIToken },
    });
  }

  /**
   * Calls the ip-api.com
   * @param {*} ip: the ip to ask about
   */
  async ipData(ip) {
    // TODO: sorround with TRY-CATCH and throw
    //    new HTTPError(response.error.data.message, response.status);
    const response = await this.IP_DATA_API.get(`${ip}?fields=country,countryCode,lat,lon,currency`);
    return response.data;
  }
}

module.exports = { IpData };
