const fs = require('fs');
const path = require('path');

const conteudo = `# 📈 API de Cotações B3 com Yahoo Finance e BrAPI

Esta API permite consultar cotações atualizadas de ações da B3 utilizando duas fontes:

- [yahoo-finance2](https://www.npmjs.com/package/yahoo-finance2)
- [brapi.dev](https://brapi.dev/)

Os dados são formatados em português e salvos automaticamente em arquivos \`.json\`.

---

## 🚀 Endpoints

### 🔹 \`GET /api/stocks/yahoofinance\`

Consulta múltiplos ativos simultaneamente via Yahoo Finance.

#### Parâmetros:
- \`symbols\` (obrigatório): lista separada por vírgulas com os códigos das ações no formato do Yahoo Finance (ex: \`PETR4.SA\`, \`VALE3.SA\`).

#### Exemplo:
\`\`\`
GET http://localhost:3001/api/stocks/yahoofinance?symbols=BBDC4.SA
\`\`\`

#### Resposta:
\`\`\`json
[
  {
    "nome": "Banco Bradesco S.A.",
    "símbolo": "BBDC4.SA",
    "preçoAtual": 16.67,
    "aberturaHoje": 16.66,
    "fechamentoAnterior": 16.75,
    "máximaHoje": 16.79,
    "mínimaHoje": 16.62,
    "volume": 11760600,
    "variação": -0.08,
    "percentual": -0.48,
    "preçoCompra": 16.67,
    "preçoVenda": 16.69,
    "máxima52Semanas": 16.95,
    "mínima52Semanas": 11.06,
    "dividendYieldAtual": 1.35,
    "dividendRateEstimado": 0.23,
    "dividendosUltimos12Meses": 0.065,
    "atualizadoEm": "2025-07-04T20:07:34.000Z"
  }
]
\`\`\`

---

### 🔹 \`GET /api/stocks/quotes\`

Consulta múltiplos ativos via BrAPI.

#### Parâmetros:
- \`symbols\` (obrigatório): lista separada por vírgulas com os códigos das ações (ex: \`PETR4,VALE3\`).

#### Exemplo:
\`\`\`
GET http://localhost:3001/api/stocks/quotes?symbols=PETR4,VALE3
\`\`\`

---

## 💾 Salvamento automático

As cotações são salvas automaticamente em arquivos \`.json\`:

- Yahoo Finance: \`/dados/cotacoes-AAAA-MM-DD-HH-MM.json\`
- BrAPI: \`/cotacoes/cotacoesBrApi.json\`

---

## ⏰ Coleta automática agendada

O script \`src/scripts/coletarCotacoes.js\` executa a coleta de cotações todos os dias úteis às 18h usando \`node-cron\`.

### Como executar:
\`\`\`bash
node src/scripts/coletarCotacoes.js
\`\`\`

---

## 📦 Dependências principais

- \`express\`
- \`axios\`
- \`yahoo-finance2\`
- \`node-cron\`
- \`dotenv\`

---

## 📁 Estrutura de pastas

\`\`\`
/src
  ├── controllers/
  │   ├── yahooFinanceController.js
  │   └── brapiController.js
  ├── routes/
  │   └── stockRoutes.js
  ├── utils/
  │   └── fileUtils.js
  ├── scripts/
  │   ├── coletarCotacoes.js
  │   └── gerarReadme.js
  └── server.js
/dados/
  └── cotacoes-AAAA-MM-DD-HH-MM.json
/cotacoes/
  └── cotacoesBrApi.json
.env
README.md
package.json
\`\`\`

---

## 📌 Observações

- Os dados do Yahoo Finance têm atraso de até 15 minutos.
- Os arquivos são sobrescritos diariamente, exceto quando salvos com hora.
- A API BrAPI requer uma chave de autenticação via \`process.env.BRAPI_API_KEY\`.
`;

const caminho = path.resolve('README.md');
fs.writeFileSync(caminho, conteudo, 'utf-8');
console.log('✅ README.md atualizado com sucesso!');
