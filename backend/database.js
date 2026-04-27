const sqlite3 = require("sqlite3").verbose();

// cria ou abre o banco
const db = new sqlite3.Database("./banco.db");

// cria tabela se não existir
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS consumos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      primeiroNome TEXT,
      ultimoNome TEXT,
      setor TEXT,
      produto TEXT,
      quantidade INTEGER,
      data TEXT
    )
  `);
});

module.exports = db;