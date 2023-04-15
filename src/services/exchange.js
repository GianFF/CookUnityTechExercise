/* eslint-disable max-classes-per-file */
const axios = require('axios');
const { HTTPError } = require('../errors/httpError');

class Exchange {
  constructor(APILayerToken) {
    this.apiKey = APILayerToken;
    this.apiURL = 'https://api.apilayer.com/exchangerates_data/convert';
  }

  /**
   * Calls api.apilayer.com
   * @param {*} currency: the currency to ask about
   */
  async currencyExchangeData(currency) {
    try {
      const headers = {
        headers: { apikey: this.apiKey },
      };
      const response = await axios.get(`${this.apiURL}?to=USD&from=${currency}&amount=1`, headers);
      return response.data;
    } catch (error) {
      throw new HTTPError(error.response.data.error.message, error.response.status);
    }
  }
}

class MockExchange extends Exchange {
  constructor(apiKey, fail = false) {
    super(apiKey);
    this.fail = fail;
  }

  /**
   * Mocks a call to the api.apilayer.com and returns mock data
   */
  // eslint-disable-next-line class-methods-use-this
  async currencyExchangeData() {
    if (this.fail) {
      return Promise.reject(
        new HTTPError('Error: You have entered an invalid date. [Required format: date=YYYY-MM-DD]', 404),
      );
    }
    return Promise.resolve({
      info: {
        rate: 0.004689,
      },
    });
  }
}

module.exports = { Exchange, MockExchange };
