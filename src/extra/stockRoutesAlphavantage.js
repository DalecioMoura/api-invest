// routes/stockRoutes.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const caminho = path.join(__dirname, '../cotacoes/cotacoes.json');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY2;
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Função auxiliar para atrasar a execução (para respeitar limites de API)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Rota para obter cotações de múltiplos ativos
// Exemplo de uso: GET /api/stocks/quotes?symbols=IBM,AAPL,MSFT
router.get('/stocks/quotes', async (req, res) => {
    const { symbols } = req.query; // Obtém os símbolos da query string (ex: ?symbols=IBM,AAPL)

    if (!symbols) {
        return res.status(400).json({ error: 'Símbolos dos ativos são obrigatórios. Use vírgula para separar.' });
    }

    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
    const results = [];
    const errors = [];

    // Limite de requisições da Alpha Vantage: 5 requisições por minuto
    // Isso significa que precisamos de um atraso de no mínimo ~12 segundos entre cada requisição.
    const REQUEST_DELAY_MS = 13000; // 13 segundos para garantir que não bata no limite por minuto

    for (let i = 0; i < symbolList.length; i++) {
        const symbol = symbolList[i];
        try {
            // Atraso antes de cada requisição, exceto a primeira
            if (i > 0) {
                console.log(`Aguardando ${REQUEST_DELAY_MS / 1000} segundos antes da próxima requisição para ${symbol}...`);
                await delay(REQUEST_DELAY_MS);
            }

            const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
                params: {
                    function: 'GLOBAL_QUOTE',
                    symbol: symbol,
                    apikey: ALPHA_VANTAGE_API_KEY
                }
            });

            const data = response.data;

            if (data['Error Message'] || Object.keys(data['Global Quote']).length === 0) {
                errors.push({ symbol: symbol, error: 'Símbolo não encontrado ou erro na API externa.', details: data });
            } else if (data['Note'] && data['Note'].includes('5 calls per minute')) {
                 // Captura o erro de limite de requisições específico
                errors.push({ symbol: symbol, error: 'Limite de requisições Alpha Vantage excedido. Tente novamente mais tarde.', details: data });
                // Se o limite foi atingido, pode ser bom parar ou tentar um atraso maior
                console.error(`Limite de requisições atingido para ${symbol}. Parando processamento.`);
                break; // Opcional: Para o loop se o limite for atingido
            }
            else {
                const quoteData = data['Global Quote'];
                const formattedQuote = {
                    symbol: quoteData['01. symbol'],
                    open: parseFloat(quoteData['02. open']),
                    high: parseFloat(quoteData['03. high']),
                    low: parseFloat(quoteData['04. low']),
                    price: parseFloat(quoteData['05. price']),
                    volume: parseInt(quoteData['06. volume']),
                    latestTradingDay: quoteData['07. latest trading day'],
                    previousClose: parseFloat(quoteData['08. previous close']),
                    change: parseFloat(quoteData['09. change']),
                    changePercent: parseFloat(quoteData['10. change percent'].replace('%', ''))
                };
                results.push(formattedQuote);
            }

        } catch (error) {
            console.error(`Erro ao buscar cotação para ${symbol}:`, error.message);
            errors.push({ symbol: symbol, error: 'Erro interno do servidor.', details: error.message });
        }
    }

    if (errors.length > 0) {
        fs.writeFileSync(caminho, JSON.stringify(results, null, 2));
        return res.status(200).json({ data: results, errors: errors, message: 'Alguns símbolos não puderam ser processados ou limites de API foram atingidos.' });
    }
    fs.writeFileSync(caminho, JSON.stringify(results, null, 2));
    res.json(results);
});

// Certifique-se de que a rota individual anterior ainda está lá se você precisar dela
// router.get('/stock/quote', async (req, res) => { ... });

module.exports = router;