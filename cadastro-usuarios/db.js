const { Pool } = require('pg');

const pool = new Pool({
  user: 'seu_usuario',
  host: 'localhost',
  database: 'usuarios_db',
  password: 'sua_senha',
  port: 5432,
});

module.exports = pool;
