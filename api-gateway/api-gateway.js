const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000; // Gateway vai rodar na porta 3000

app.use(cors());
app.use(express.json());

// --- Rotas para Cadastro de Usuários ---
app.post('/usuarios', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8081/usuarios', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:8081/usuarios');
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// --- Rotas para Cadastro de Alarmes ---
app.post('/alarmes', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:8082/alarmes', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/alarmes-com-estado', async (req, res) => {
  try {
    // Passo 1: Buscar lista de alarmes
    const alarmesResp = await axios.get('http://localhost:8082/alarmes');
    const alarmes = alarmesResp.data;

    // Passo 2: Para cada alarme, buscar seu estado atual
    // Usar Promise.all para executar as requisições em paralelo
    const alarmesComEstado = await Promise.all(
      alarmes.map(async (alarme) => {
        try {
          const estadoResp = await axios.get(`http://localhost:3002/acionamento/estado/${alarme.id}`);
          alarme.estadoAtual = estadoResp.data.estado;
        } catch (error) {
          alarme.estadoAtual = 'desligado'; // caso não consiga pegar o estado
        }
        return alarme;
      })
    );

    // Retorna a lista com estado atual
    res.json(alarmesComEstado);

  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});


app.post('/acionamento/acionar', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3002/acionamento/acionar', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// --- Rotas para Controle de Disparo ---
app.post('/disparos', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3003/disparos', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/disparos/:id_alarme', async (req, res) => {
  try {
    const { id_alarme } = req.params;
    const response = await axios.get(`http://localhost:3003/disparos/${id_alarme}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// --- Rotas para Logging ---
app.post('/log', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3005/log', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.get('/logs', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3005/logs');
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// --- Rota para Notificações ---
app.post('/notificar', async (req, res) => {
  try {
    const response = await axios.post('http://localhost:3006/notificar', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// --- Rotas para Acionar e Desarmar com Notificação (atuais no disparo service) ---
// Acionar e enviar notificação
app.post('/acionar', async (req, res) => {
  try {
    // Chamar controle de acionamento
    const acionamentoResp = await axios.post('http://localhost:3002/acionamento/acionar', req.body);

    // Depois enviar notificação
    const { userEmail } = req.body; // precisa enviar email no corpo da requisição
    if (userEmail) {
      await axios.post('http://localhost:3006/notificar', {
        email: userEmail,
        assunto: 'Alarme acionado',
        mensagem: 'O seu alarme foi acionado com sucesso.'
      });
    }

    res.status(acionamentoResp.status).json(acionamentoResp.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// Desarmar e enviar notificação
app.post('/desarmar', async (req, res) => {
  try {
    // Aqui, precisa criar rota equivalente no controle de acionamento para desarmar, exemplo:
    // Vamos supor que seja http://localhost:3002/acionamento/desarmar

    const desarmarResp = await axios.post('http://localhost:3002/acionamento/desarmar', req.body);

    // Depois enviar notificação
    const { userEmail } = req.body;
    if (userEmail) {
      await axios.post('http://localhost:3006/notificar', {
        email: userEmail,
        assunto: 'Alarme desarmado',
        mensagem: 'O seu alarme foi desarmado com sucesso.'
      });
    }

    res.status(desarmarResp.status).json(desarmarResp.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway rodando na porta ${PORT}`);
});
