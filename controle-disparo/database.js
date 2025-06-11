const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./disparos.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS disparos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_alarme INTEGER,
      motivo TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
