require('dotenv').config();
const axios = require('axios');

async function getMarketstackQuote(symbol) {
  try {
    const response = await axios.get(`http://api.marketstack.com/v1/eod/latest`, {
      params: {
        access_key: process.env.MARKETSTACK_API_KEY,
        symbols: symbol
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Erro Marketstack:', error.message);
  }
}

getMarketstackQuote('MGLU3.SA');
