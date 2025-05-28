const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/usuarios', async (req, res) => {
  const response = await axios.post('http://localhost:3001/usuarios', req.body);
  res.send(response.data);
});

app.get('/usuarios', async (req, res) => {
  const response = await axios.get('http://localhost:3001/usuarios');
  res.send(response.data);
});

// Aqui você adicionará os outros endpoints dos microserviços...

app.listen(3000, () => console.log('API Gateway rodando na porta 3000'));
