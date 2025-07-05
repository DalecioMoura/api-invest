const axios = require('axios');

async function getStatusInvest(ticker) {
  try {
    const response = await axios.post('https://statusinvest.com.br/acao/resultado', {
      codes: [ticker],
      isAsc: true,
      orderBy: "cotacao"
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log(response.data);
  } catch (error) {
    console.error('Erro StatusInvest:', error.message);
  }
}

getStatusInvest('WEGE3');
