const express = require('express');
const router = express.Router();
const db = require('./db');

// Registrar disparo do alarme
router.post('/disparar', async (req, res) => {
  const { alarme_id, local, motivo } = req.body;

  try {
    const query = `
      INSERT INTO disparos (alarme_id, local_disparo, motivo, data_hora)
      VALUES ($1, $2, $3, NOW())
      RETURNING *`;
    const result = await db.query(query, [alarme_id, local, motivo]);

    res.json({ message: 'Disparo registrado', disparo: result.rows[0] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Listar disparos de um alarme
router.get('/disparos/:alarme_id', async (req, res) => {
  const { alarme_id } = req.params;

  try {
    const query = `
      SELECT * FROM disparos
      WHERE alarme_id = $1
      ORDER BY data_hora DESC
    `;
    const result = await db.query(query, [alarme_id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
