const express = require('express');
const router = express.Router(); // 💡 ESSENCIAL! Cria o roteador Express

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const arquivo = path.join(__dirname, '../cotacoes/cotacoes.json');

// Garante que a pasta exista
function garantirDiretorio() {
  const dir = path.dirname(arquivo);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

router.get('/stocks/quotes', async (req, res) => {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({
      error: 'Parâmetro "symbols" é obrigatório. Exemplo: ?symbols=PETR4,VALE3'
    });
  }

  const lista = symbols
    .split(',')
    .map(s => s.trim().toUpperCase());

  const resultados = [];

  for (const ativo of lista) {
    try {
      console.log(`🔎 Buscando ${ativo}...`);
      const response = await axios.get(`https://brapi.dev/api/quote/${ativo}`, {
        headers: {
          Authorization: process.env.BRAPI_API_KEY // sem "Bearer"
        }
      });

      const dados = response.data?.results;
      if (dados && dados.length > 0) {
        resultados.push(...dados);
        console.log(`✅ ${ativo} encontrado`);
      } else {
        console.warn(`⚠️ Nenhum dado retornado para ${ativo}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao consultar ${ativo}:`, error.message);
    }
  }

  garantirDiretorio();
  fs.writeFileSync(arquivo, JSON.stringify(resultados, null, 2), 'utf-8');
  console.log('📁 cotacoes.json atualizado com sucesso');

  res.json({ data: resultados });
});

module.exports = router;
