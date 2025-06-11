const express = require('express');
const router = express.Router();
const db = require('./database');

// Ligar ou desligar alarme
router.post('/acionar', (req, res) => {
  const { id_alarme, estado } = req.body;

  if (!id_alarme || !estado) {
    return res.status(400).json({ error: 'id_alarme e estado são obrigatórios' });
  }

  db.run(
    'INSERT INTO estados_alarme (id_alarme, estado) VALUES (?, ?)',
    [id_alarme, estado],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao acionar alarme' });
      }

      res.status(201).json({ id: this.lastID, id_alarme, estado });
    }
  );
});

// Obter o último estado do alarme
router.get('/estado/:id_alarme', (req, res) => {
  const { id_alarme } = req.params;

  db.get(
    'SELECT * FROM estados_alarme WHERE id_alarme = ? ORDER BY timestamp DESC LIMIT 1',
    [id_alarme],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao consultar estado' });
      }

      if (!row) {
        return res.status(404).json({ error: 'Estado não encontrado' });
      }

      res.json(row);
    }
  );
});

module.exports = router;
