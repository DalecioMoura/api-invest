const axios = require('axios');

async function getInvestingQuote(id) {
  try {
    const response = await axios.get(`https://www.investing.com/instruments/HistoricalDataAjax`, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        pairID: id, // ID numérico do ativo
        interval_sec: 'Daily',
        action: 'historical_data'
      }
    });

    console.log(response.data);
  } catch (error) {
    console.error('Erro Investing.com:', error.message);
  }
}

// IDs podem mudar. Ex: PETR4 = 952168
getInvestingQuote(952168);
