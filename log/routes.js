const express = require('express');
const router = express.Router();
const db = require('./db');

// Registrar evento de monitoramento
router.post('/evento', async (req, res) => {
  const { sensor_id, status, descricao } = req.body;

  try {
    const query = `
      INSERT INTO eventos_monitoramento (sensor_id, status, descricao, data_hora)
      VALUES ($1, $2, $3, NOW())
      RETURNING *`;
    const result = await db.query(query, [sensor_id, status, descricao]);

    res.json({ message: 'Evento registrado', evento: result.rows[0] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Listar eventos de um sensor
router.get('/eventos/:sensor_id', async (req, res) => {
  const { sensor_id } = req.params;

  try {
    const query = `
      SELECT * FROM eventos_monitoramento
      WHERE sensor_id = $1
      ORDER BY data_hora DESC
    `;
    const result = await db.query(query, [sensor_id]);

    res.json(result.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
