const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const arquivo = path.join(__dirname, '../cotacoes/cotacoes.json');

// Cria a pasta se não existir
function garantirDiretorio() {
  const dir = path.dirname(arquivo);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Nova rota usando o endpoint brapi.dev baseado em busca
router.get('/stocks/quotes', async (req, res) => {
  const { search } = req.query;
  if (!search) {
    return res.status(400).json({
      error: 'Parâmetro "search" é obrigatório. Exemplo: ?search=PETR'
    });
  }

  try {
    const response = await axios.get('https://brapi.dev/api/quote/list', {
      params: {
        search: search,
        sortBy: 'close',
        sortOrder: 'desc',
        limit: 10,
        page: 1,
        type: 'stock'
      },
      headers: {
        Authorization: process.env.BRAPI_API_KEY // sem "Bearer"
      }
    });

    const resultados = response.data?.stocks || [];

    garantirDiretorio();
    fs.writeFileSync(arquivo, JSON.stringify(resultados, null, 2), 'utf-8');
    console.log('✔ Arquivo cotacoes.json salvo com sucesso!');
    res.json({ data: resultados });

  } catch (error) {
    console.error('Erro ao consultar a Brapi:', error.message);
    res.status(500).json({
      error: 'Erro ao consultar a API da Brapi',
      detalhes: error.message
    });
  }
});

module.exports = router;
