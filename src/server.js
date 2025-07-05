require('dotenv').config(); //carrega as variáveis de ambiente do arquivo .env

const express   = require('express');
const app       = express();
const PORT      = process.env.PORT || 3000;

//Middleware para parsear JSON no corpo das requisições
app.use(express.json());

//Importar e usar as rotas da API
const stockRoutes = require('../src/routes/stockRoutes');
app.use('/api', stockRoutes);

//Rota de teste simples
app.get('/', (req, res)=>{
    res.send('API de investimentos está funcionando!');
});

//Iniciar servidor
app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
})



