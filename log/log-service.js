// logging-service.js
import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// POST /log - cria um novo log
app.post('/log', (req, res) => {
  const { servico, mensagem } = req.body;
  if (!servico || !mensagem) {
    return res.status(400).json({ erro: 'Campos obrigatórios: servico, mensagem' });
  }

  db.run(
    `INSERT INTO logs (servico, mensagem) VALUES (?, ?)`,
    [servico, mensagem],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });
      res.status(201).json({ id: this.lastID, servico, mensagem });
    }
  );
});

// GET /logs - retorna todos os logs
app.get('/logs', (req, res) => {
  db.all(`SELECT * FROM logs ORDER BY timestamp DESC`, (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.listen(3005, () => {
  console.log('Logging Service rodando na porta 3005');
});
