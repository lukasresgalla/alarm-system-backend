const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./acionamento.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS estados_alarme (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_alarme INTEGER NOT NULL,
      estado TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
