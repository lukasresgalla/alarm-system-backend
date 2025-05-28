const express = require('express');
const router = express.Router();
const db = require('./db');

// Cadastrar novo alarme
router.post('/alarmes', async (req, res) => {
  const { local_instalacao, usuarios_permitidos, pontos_monitorados } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO alarmes (local_instalacao, usuarios_permitidos, pontos_monitorados)
       VALUES ($1, $2, $3) RETURNING *`,
      [local_instalacao, usuarios_permitidos, pontos_monitorados]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Listar alarmes
router.get('/alarmes', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM alarmes');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
