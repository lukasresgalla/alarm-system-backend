const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// criar alarme
app.post('/alarmes', (req, res) => {
  const { local, descricao } = req.body;

  db.run(
    `INSERT INTO alarmes (local, descricao) VALUES (?, ?)`,
    [local, descricao],
    function (err) {
      if (err) return res.status(500).json({ erro: err.message });

      res.status(201).json({
        id: this.lastID,
        local,
        descricao,
      });
    }
  );
});

// listar alarmes
app.get('/alarmes', (req, res) => {
  db.all(`SELECT * FROM alarmes`, [], (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });

    res.status(200).json(rows);
  });
});

app.listen(8082, () => {
  console.log('Microserviço de Alarmes rodando na porta 8082');
});
