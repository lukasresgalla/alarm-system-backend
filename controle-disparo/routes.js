const express = require('express');
const axios = require('axios');
const db = require('./database');

const router = express.Router();

// registra disparo
router.post('/disparos', (req, res) => {
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

// consulta disparos
router.get('/disparos/:id_alarme', (req, res) => {
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

module.exports = router;
