// Banco em memória (temporário)
let consumos = [];

console.log("INICIOU ARQUIVO");

// Importações
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

/**
 * ROTA POST - salvar consumo
 */
app.post("/consumo", (req, res) => {
  const consumo = req.body;

  if (!consumo) {
    return res.status(400).json({ erro: "Dados não enviados" });
  }

  const novoConsumo = {
    ...consumo,
    id: consumos.length + 1,
    data: new Date()
  };

  consumos.push(novoConsumo);

  console.log("💾 SALVO:", novoConsumo);

  res.json({ sucesso: true, id: novoConsumo.id });
});

/**
 * ROTA GET - listar consumos
 */
app.get("/consumos", (req, res) => {
  res.json(consumos);
});

/**
 * ROTA TESTE (opcional)
 */
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

/**
 * INICIAR SERVIDOR
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});