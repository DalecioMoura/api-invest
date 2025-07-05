require('dotenv').config();
const axios = require('axios');

async function getTwelveQuote(symbol) {
  try {
    const response = await axios.get(`https://api.twelvedata.com/quote`, {
      params: {
        symbol: symbol,
        apikey: process.env.TWELVE_DATA_API_KEY
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Erro Twelve Data:', error.message);
  }
}

getTwelveQuote('PETR4.SA');
