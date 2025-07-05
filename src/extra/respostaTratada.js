const yahooFinance = require('yahoo-finance2').default;

async function getHistoricalData(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({
      error: 'Parâmetro "symbol" é obrigatório. Exemplo: ?symbol=PETR4.SA'
    });
  }

  try {
    const data = await yahooFinance.quote(symbol);

    const respostaFormatada = {
      nome: data.longName,
      símbolo: data.symbol,
      preçoAtual: data.regularMarketPrice,
      aberturaHoje: data.regularMarketOpen,
      fechamentoAnterior: data.regularMarketPreviousClose,
      variação: Number(data.regularMarketChange.toFixed(2)),
      percentual: Number((data.regularMarketChangePercent).toFixed(2)),
      máximaHoje: data.regularMarketDayHigh,
      mínimaHoje: data.regularMarketDayLow,
      volume: data.regularMarketVolume,
      máxima52Semanas: data.fiftyTwoWeekHigh,
      mínima52Semanas: data.fiftyTwoWeekLow,
      dividendYieldAtual: data.dividendYield,
      dividendRateEstimado: data.dividendRate,
      dividendosUltimos12Meses: data.trailingAnnualDividendRate,
      atualizadoEm: data.regularMarketTime
    };

    res.json(respostaFormatada);
  } catch (error) {
    console.error('Erro ao buscar cotação no Yahoo Finance:', error.message);
    res.status(500).json({ error: 'Erro ao buscar cotação' });
  }
}

module.exports = { getHistoricalData };
