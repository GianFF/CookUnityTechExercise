const axios = require('axios');

class Exchange {
  constructor(APILayerToken) {
    this.EXCHANGE_RATE_DATA_API = axios.create({
      baseURL: 'https://api.apilayer.com/exchangerates_data/convert',
      timeout: 1000,
      headers: { apikey: APILayerToken },
    });
  }

  /**
   * Calls api.apilayer.com
   * @param {*} currency: the currency to ask about
   */
  async currencyExchangeData(currency) {
    return this.EXCHANGE_RATE_DATA_API.get(`?to=USD&from=${currency}&amount=1`);
  }
}

module.exports = { Exchange };
