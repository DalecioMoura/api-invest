const express   = require('express');
const router    = express.Router();
const axios     = require('axios');
const fs = require('fs');
const path = require('path');

const caminnhoCotacoes = path.join(__dirname, '../cotacoes/cotacoes.json')

//---Configurações da API externa de cotações---
//IMPORTANTE: Você precisará de uma API de dados financeiros.
//Algumas opções gratuitas (com limites): Alpha Vantage, Twelve Data, Financial Modeling Prep.
//Para este exemplo, amos supor que estamos usando Alpha Vantage.
//Crie sua chave de API em: https://www.alphavantage.co/suport/#api-key.
const ALPHA_VANTAGE_API_KEY = [
                                process.env.ALPHA_VANTAGE_API_KEY1,
                                process.env.ALPHA_VANTAGE_API_KEY2,
                                process.env.ALPHA_VANTAGE_API_KEY3,
                                process.env.ALPHA_VANTAGE_API_KEY4
                                ];//const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

//Rota para obter a cotação de uma ação.
//Exemplo de uso: GET /api/stock/quotes?symbol=IBM
router.get('/stock/quote', async (req, res)=>{
    const {symbol} = req.query; //Obtém o simbolo da query string (ex: ?symbol=IBM)
    console.log('simbolo: ', symbol)
    if(!symbol){
        return res.status(400).json({error: 'Simbolo do ativo é obrigatório'});

    }

    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
    const results = [];
    const errors = [];

    try{
        const response = await axios.get(ALPA_VANTAGE_BASE_URL, {
            params: {
                function: 'GLOBAL_QUOTE',
                symbol: symbol,
                apikey: ALPHA_VANTAGE_API_KEY[0]
            }
        });

        const data = response.data;

        //Verifica se a API externa retornou um erro ou não encontrou o simbolo
        if(data['Error Message'] || Object.keys(data['Global Quote']).length == 0) {
            return res.status(404).json({error: 'Simbolo do ativo não encontrado ou erro na API externa', details: data});
        }

        const quoteData = data['Global Quote'];

        //Formata os dados para um retorno mais limpo
        const formattedQuote = {
            symbol: quoteData['01. symbol'],
            open: parseFloat(quoteData['02. open']),
            high: parseFloat(quoteData['03. high']),
            low: parseFloat(quoteData['04. low']),
            price: parseFloat(quoteData['05. price']),
            volume: parseInt(quoteData['06. volume']),
            LatestTradingDay: quoteData['07. latest trading day'],
            previousClose: parseFloat(quoteData['08. previous close']),
            change: parseFloat(quoteData['09. change']),
            changePercent: parseFloat(quoteData['10. change percent'].replace('%', '')),
        };

        res.json(formattedQuote);

    }catch(error){
        console.log('Erro ao bucar cotação: ', error.message);
        res.status(500).json({error: 'Erro interno do servidor ao buscar cotação', details: error.message});
    }
});

module.exports = router;
