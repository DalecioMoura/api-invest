require('dotenv').config();
const axios = require('axios');

async function getFinnhubQuote(symbol) {
  try {
    const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
      params: {
        symbol: symbol,
        token: process.env.FINNHUB_API_KEY
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Erro Finnhub:', error.message);
  }
}

getFinnhubQuote('VALE.SA');
