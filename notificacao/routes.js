const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/', async (req, res) => {
  try {
    const notificacao = await db.createNotificacao(req.body);
    res.status(201).json(notificacao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar notificação' });
  }
});

router.get('/', async (req, res) => {
  try {
    const notificacoes = await db.getAllNotificacoes();
    res.json(notificacoes);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar notificações' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const notificacao = await db.getNotificacaoById(req.params.id);
    if (!notificacao) return res.status(404).json({ error: 'Notificação não encontrada' });
    res.json(notificacao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar notificação' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const notificacao = await db.updateNotificacaoStatus(req.params.id, status);
    if (!notificacao) return res.status(404).json({ error: 'Notificação não encontrada' });
    res.json(notificacao);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await db.deleteNotificacao(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar notificação' });
  }
});

module.exports = router;
