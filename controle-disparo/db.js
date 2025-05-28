const { Pool } = require('pg');

const pool = new Pool({
  user: 'seu_usuario',       // substitua pelo seu usuário do Postgres
  host: 'localhost',
  database: 'controle_disparo_db',
  password: 'sua_senha',     // substitua pela sua senha
  port: 5432,
});

module.exports = pool;
