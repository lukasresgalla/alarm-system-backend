const express = require('express');
const bodyParser = require('body-parser');
const notificacaoController = require('./controller');

const app = express();
app.use(bodyParser.json());

app.post('/notificacoes', notificacaoController.criarNotificacao);
app.get('/notificacoes', notificacaoController.listarNotificacoes);
app.get('/notificacoes/:id', notificacaoController.buscarNotificacao);
app.put('/notificacoes/:id', notificacaoController.atualizarStatus);
app.delete('/notificacoes/:id', notificacaoController.deletarNotificacao);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  console.log(`Microserviço de Notificação rodando na porta ${PORT}`);
});
