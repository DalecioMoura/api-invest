const axios = require('axios');
const { salvarArquivo } = require('../utils/salvarArquivo');
const cron = require('node-cron');

const symbols = [
  'PETR4.SA', 'VALE3.SA', 'RECV3.SA', 'BRAV3.SA', 'BBAS3.SA',
  'BRAP3.SA', 'BRAP4.SA', 'GGBR4.SA', 'GOAU4.SA',
  'VGRI11.SA', 'VGIR11.SA', 'VGIA11.SA', 'VCRI11.SA',
  'AGRX11.SA', 'MXRF11.SA'
];

//const url = `http://localhost:3001/api/stocks/investing?symbols=${symbols.join(',')}`;
const url = `https://api-invest-f0s1.onrender.com/api/stocks/yahoofinance?symbols=${symbols.join(',')}`;

// Agendar para dias úteis às 18h (segunda a sexta)
cron.schedule('0 18 * * 1-5', async () => {
  try {
    console.log('⏳ Coletando cotações...');
    const response = await axios.get(url);
    const dados = response.data;

    const agora = new Date();
    const data = agora.toISOString().split('T')[0];
    const hora = agora.toTimeString().split(' ')[0].replace(/:/g, '-');
    const nomeArquivo = `dados/cotacoes-${data}-${hora}.json`;

    salvarArquivo(nomeArquivo, dados);
    console.log('✅ Cotações salvas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao coletar cotações:', error.message);
  }
});
