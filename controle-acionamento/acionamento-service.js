const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use('/acionamento', routes);

app.listen(PORT, () => {
  console.log(`Controle de Acionamento rodando em http://localhost:${PORT}`);
});
