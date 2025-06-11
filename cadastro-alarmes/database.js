const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('alarmes.db');

// cria a tabela de alarmes 
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS alarmes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      local TEXT NOT NULL,
      descricao TEXT
    )
  `);
});

module.exports = db;
