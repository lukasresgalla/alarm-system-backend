const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

// permite json no post
app.use(bodyParser.json());

const db = new sqlite3.Database('./usuarios.db', (err) => {
    if (err) throw err;
    console.log('Banco de usuários conectado.');
});

// cria tabela
db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
)`);

// cria usuario
app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;
    db.run(`INSERT INTO usuarios (nome, email) VALUES (?, ?)`,
        [nome, email],
        function (err) {
            if (err) return res.status(500).json({ erro: err.message });
            res.status(201).json({ id: this.lastID, nome, email });
        });
});

// lista usuarios
app.get('/usuarios', (req, res) => {
    db.all(`SELECT * FROM usuarios`, [], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    });
});

app.listen(8081, () => {
    console.log('Serviço de usuários rodando na porta 8081.');
});
