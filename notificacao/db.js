const { Pool } = require('pg');

const pool = new Pool({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'notificacao_db',
  password: 'sua_senha',
  port: 5432,
});

const createNotificacao = async (notificacao) => {
  const { evento_id, tipo, destinatario, mensagem, status } = notificacao;
  const query = `
    INSERT INTO notificacoes (evento_id, tipo, destinatario, mensagem, status)
    VALUES ($1, $2, $3, $4, $5) RETURNING *;
  `;
  const values = [evento_id, tipo, destinatario, mensagem, status || 'pendente'];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getAllNotificacoes = async () => {
  const { rows } = await pool.query('SELECT * FROM notificacoes ORDER BY data_envio DESC;');
  return rows;
};

const getNotificacaoById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM notificacoes WHERE id = $1;', [id]);
  return rows[0];
};

const updateNotificacaoStatus = async (id, status) => {
  const query = `
    UPDATE notificacoes SET status = $1 WHERE id = $2 RETURNING *;
  `;
  const { rows } = await pool.query(query, [status, id]);
  return rows[0];
};

const deleteNotificacao = async (id) => {
  await pool.query('DELETE FROM notificacoes WHERE id = $1;', [id]);
};

module.exports = {
  createNotificacao,
  getAllNotificacoes,
  getNotificacaoById,
  updateNotificacaoStatus,
  deleteNotificacao,
};
