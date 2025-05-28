const express = require('express');
const router = express.Router();
const db = require('./db');
const axios = require('axios');

// Armar ou desarmar alarme
router.post('/acionar', async (req, res) => {
  const { alarme_id, acao, origem } = req.body; // acao = "armar" ou "desarmar"

  try {
    const result = await db.query(
      `INSERT INTO acionamentos (alarme_id, acao, origem)
       VALUES ($1, $2, $3) RETURNING *`,
      [alarme_id, acao, origem]
    );

    // Simular envio de notificação
    await axios.post('http://localhost:3005/notificar', {
      alarme_id,
      mensagem: `Alarme ${acao} via ${origem}`
    });

    // Simular logging
    await axios.post('http://localhost:3006/log', {
      evento: `Alarme ${acao} via ${origem}`,
      alarme_id
    });

    res.json({ status: 'ok', data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Erro ao acionar/desarmar alarme');
  }
});

// Histórico
router.get('/historico', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM acionamentos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
