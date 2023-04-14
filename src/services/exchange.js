const axios = require('axios');

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
    // TODO: sorround with TRY-CATCH and throw
    //    new HTTPError(response.error.data.message, response.status);
    const headers = {
      headers: { apikey: this.apiKey },
    };
    const response = await axios.get(`${this.apiURL}?to=USD&from=${currency}&amount=1`, headers);
    return response.data;
  }
}

module.exports = { Exchange };
