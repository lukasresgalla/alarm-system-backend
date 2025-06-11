// db.js
import sqlite3 from 'sqlite3';
sqlite3.verbose();

const db = new sqlite3.Database('./logs.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      servico TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;
