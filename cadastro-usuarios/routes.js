const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/usuarios', async (req, res) => {
  const { nome, telefone } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO usuarios (nome, telefone) VALUES ($1, $2) RETURNING *',
      [nome, telefone]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get('/usuarios', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
