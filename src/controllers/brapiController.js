const { salvarArquivo } = require('../utils/fileUtils');
const axios = require('axios');

async function getQuotes(req, res) {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({
      error: 'Parâmetro "symbols" é obrigatório. Exemplo: ?symbols=PETR4,VALE3'
    });
  }

  const lista = symbols.split(',').map(s => s.trim().toUpperCase());
  const resultados = [];

  for (const ativo of lista) {
    try {
      const response = await axios.get(`https://brapi.dev/api/quote/${ativo}`, {
        headers: {
          Authorization: process.env.BRAPI_API_KEY
        }
      });

      const dados = response.data?.results;
      if (dados && dados.length > 0) {
        resultados.push(...dados);
      }
    } catch (error) {
      console.error(`Erro ao consultar ${ativo}:`, error.message);
    }
  }

  salvarArquivo('../cotacoes/cotacoesBrApi.json', resultados);
  res.json({ data: resultados });
}

module.exports = { getQuotes };



