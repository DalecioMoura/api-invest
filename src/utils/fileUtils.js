const fs = require('fs');
const path = require('path');

function salvarArquivo(caminhoRelativo, dados) {
  const arquivo = path.join(__dirname, '..', caminhoRelativo);
  const dir = path.dirname(arquivo);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2), 'utf-8');
  console.log(`📁 Arquivo salvo em: ${arquivo}`);
}

function salvarArquivoYahooFinance(caminhoRelativo, dados) {
  const arquivo = path.join(__dirname, '..', caminhoRelativo);
  const dir = path.dirname(arquivo);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2), 'utf-8');
  console.log(`📁 Arquivo salvo em: ${arquivo}`);
}

module.exports = { salvarArquivo, salvarArquivoYahooFinance };


