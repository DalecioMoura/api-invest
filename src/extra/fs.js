const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Caminho do arquivo onde os dados serão salvos
const filePath = path.join(__dirname, 'dados.json');

cron.schedule('0 18 * * 1-5', async () => {
  try {
    const response = await axios.get('https://exemplo.com/api/dados');
    const dados = response.data;

    // Salva os dados no arquivo .json
    fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));

    console.log('Consulta realizada e dados salvos com sucesso!');
  } catch (error) {
    console.error('Erro na consulta ou ao salvar dados:', error.message);
  }
});

console.log('Agendador em execução... Aguardando 18h em dias úteis.');
