const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const app = express();
const PORT = 3003;

app.use(cors());
app.use(express.json());

// Conexão com banco
const db = new sqlite3.Database('./disparos.db');

// Criação da tabela
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS disparos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_alarme INTEGER,
      motivo TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Rota para registrar disparo
app.post('/disparos', (req, res) => {
  const { id_alarme, motivo } = req.body;
  db.run(
    'INSERT INTO disparos (id_alarme, motivo) VALUES (?, ?)',
    [id_alarme, motivo],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID, id_alarme, motivo });
      }
    }
  );
});

// Rota para consultar disparos de um alarme
app.get('/disparos/:id_alarme', (req, res) => {
  const id_alarme = req.params.id_alarme;
  db.all(
    'SELECT * FROM disparos WHERE id_alarme = ? ORDER BY timestamp DESC',
    [id_alarme],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(rows);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Controle de Disparo rodando na porta ${PORT}`);
});


// Exemplo de função que aciona o alarme
async function acionarAlarme(userEmail) {
  // Lógica para acionar o alarme aqui...
  
  // Após acionar, chama o serviço de notificações
  try {
    await axios.post('http://localhost:3006/notificacao', { // ajuste a porta e rota da sua notificação
      email: userEmail,
      assunto: 'Alarme acionado',
      mensagem: 'O seu alarme foi acionado com sucesso.'
    });
    console.log('Notificação enviada com sucesso');
  } catch (error) {
    console.error('Erro ao enviar notificação:', error.message);
  }
}

// Exemplo de função que desarma o alarme
async function desarmarAlarme(userEmail) {
  // Lógica para desarmar o alarme aqui...
  
  try {
    await axios.post('http://localhost:3006/notificacao', {
      email: userEmail,
      assunto: 'Alarme desarmado',
      mensagem: 'O seu alarme foi desarmado com sucesso.'
    });
    console.log('Notificação enviada com sucesso');
  } catch (error) {
    console.error('Erro ao enviar notificação:', error.message);
  }
}


// Endpoint para acionar o alarme
app.post('/acionar', (req, res) => {
  const { userEmail, id_alarme } = req.body;

  db.run(
    'INSERT INTO disparos (id_alarme, motivo) VALUES (?, ?)',
    [id_alarme, 'Alarme acionado'],
    async function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {
        await axios.post('http://localhost:3006/notificar', {
          email: userEmail,
          assunto: 'Alarme acionado',
          mensagem: 'O seu alarme foi acionado com sucesso.'
        });
        res.status(200).json({ message: 'Alarme acionado e notificação enviada.' });
      } catch (error) {
        console.error('Erro ao enviar notificação:', error.message);
        res.status(500).json({ error: 'Alarme acionado, mas erro na notificação.' });
      }
    }
  );
});

// Endpoint para desarmar o alarme
app.post('/desarmar', (req, res) => {
  const { userEmail, id_alarme } = req.body;

  db.run(
    'INSERT INTO disparos (id_alarme, motivo) VALUES (?, ?)',
    [id_alarme, 'Alarme desarmado'],
    async function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      try {
        await axios.post('http://localhost:3006/notificar', {
          email: userEmail,
          assunto: 'Alarme desarmado',
          mensagem: 'O seu alarme foi desarmado com sucesso.'
        });
        res.status(200).json({ message: 'Alarme desarmado e notificação enviada.' });
      } catch (error) {
        console.error('Erro ao enviar notificação:', error.message);
        res.status(500).json({ error: 'Alarme desarmado, mas erro na notificação.' });
      }
    }
  );
});
