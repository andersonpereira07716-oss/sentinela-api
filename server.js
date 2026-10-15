const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
const apiRoutes = require('./src/routes/api');
app.use('/api', apiRoutes);

// Rota de Boas-Vindas / Status
app.get('/', (req, res) => {
    res.json({
        app: "SENTINELA ONE API",
        status: "Online",
        version: "1.0.0",
        timestamp: new Date()
    });
});

app.listen(PORT, () => {
    console.log(`Servidor Sentinela rodando na porta ${PORT}`);
});
