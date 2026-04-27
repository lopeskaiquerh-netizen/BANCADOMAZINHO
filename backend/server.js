const db = require("./database");

console.log("INICIOU ARQUIVO");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/**
 * POST - salvar consumo
 */
app.post("/consumo", (req, res) => {
  const consumo = req.body;

  console.log("🔥 CHEGOU NO BACKEND:", consumo);

  db.run(
    `INSERT INTO consumos 
     (primeiroNome, ultimoNome, setor, produto, quantidade, data)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      consumo.primeiroNome,
      consumo.ultimoNome,
      consumo.setor,
      consumo.produto,
      consumo.quantidade,
      new Date().toISOString()
    ],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ erro: "Erro ao salvar" });
      }

      console.log("💾 SALVO NO BANCO:", consumo);

      res.json({ sucesso: true, id: this.lastID });
    }
  );
});

/**
 * GET - listar consumos
 */
app.get("/consumos", (req, res) => {
  db.all("SELECT * FROM consumos", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: err.message });
    }

    res.json(rows);
  });
});

/**
 * Servidor
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});