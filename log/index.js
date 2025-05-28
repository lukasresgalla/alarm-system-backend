const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Monitoramento rodando na porta ${PORT}`);
});
