const yahooFinance = require('yahoo-finance2').default;
const { salvarArquivoYahooFinance } = require('../utils/fileUtils'); // ajuste o caminho se necessário

async function getHistoricalData(req, res) {
  const { symbols } = req.query;

  if (!symbols) {
    return res.status(400).json({
      error: 'Parâmetro "symbols" é obrigatório. Exemplo: ?symbols=PETR4.SA,VALE3.SA'
    });
  }

  const lista = symbols.split(',').map(s => s.trim());

  try {
    const resultados = await Promise.all(
      lista.map(async (symbol) => {
        const data = await yahooFinance.quote(symbol);
        return {
            nome: data.longName,
            símbolo: data.symbol,
            preçoAtual: data.regularMarketPrice,
            aberturaHoje: data.regularMarketOpen,
            fechamentoAnterior: data.regularMarketPreviousClose,
            máximaHoje: data.regularMarketDayHigh,
            mínimaHoje: data.regularMarketDayLow,
            volume: data.regularMarketVolume,
            variação: Number(data.regularMarketChange.toFixed(2)),
            percentual: Number(data.regularMarketChangePercent.toFixed(2)),
            preçoCompra: data.bid,
            preçoVenda: data.ask,
            máxima52Semanas: data.fiftyTwoWeekHigh,
            mínima52Semanas: data.fiftyTwoWeekLow,
            dividendYieldAtual: data.dividendYield,
            dividendRateEstimado: data.dividendRate,
            dividendosUltimos12Meses: data.trailingAnnualDividendRate,
            atualizadoEm: data.regularMarketTime
        };
      })
    );

    // Salvar os dados em um arquivo JSON
    const nomeArquivo = `../dados/cotacoes-${new Date().toISOString().split('T')[0]}.json`;
    salvarArquivoYahooFinance(nomeArquivo, resultados);

    res.json(resultados);
  } catch (error) {
    console.error('Erro ao buscar cotações:', error.message);
    res.status(500).json({ error: 'Erro ao buscar uma ou mais cotações' });
  }
}

module.exports = { getHistoricalData };



