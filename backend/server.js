console.log("INICIOU ARQUIVO");

// IMPORTAÇÕES
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

// CONFIG BANCO (Render)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// CRIA TABELA AUTOMATICAMENTE
pool.query(`
  CREATE TABLE IF NOT EXISTS consumos (
    id SERIAL PRIMARY KEY,
    primeiroNome TEXT,
    ultimoNome TEXT,
    setor TEXT,
    produto TEXT,
    quantidade INT,
    data TIMESTAMP
  );
`)
.then(() => console.log("✅ Tabela pronta"))
.catch(err => console.error("❌ Erro ao criar tabela:", err));

// MIDDLEWARES
app.use(cors());
app.use(express.json());

/**
 * POST - salvar consumo
 */
app.post("/consumo", async (req, res) => {
  const consumo = req.body;

  if (!consumo) {
    return res.status(400).json({ erro: "Dados não enviados" });
  }

  try {
    await pool.query(
      `INSERT INTO consumos 
       (primeiroNome, ultimoNome, setor, produto, quantidade, data)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        consumo.primeiroNome,
        consumo.ultimoNome,
        consumo.setor,
        consumo.produto,
        consumo.quantidade,
        new Date()
      ]
    );

    console.log("💾 SALVO NO BANCO:", consumo);

    res.json({ sucesso: true });

  } catch (err) {
    console.error("❌ ERRO AO SALVAR:", err);
    res.status(500).json({ erro: "Erro ao salvar" });
  }
});

/**
 * GET - listar consumos
 */
app.get("/consumos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM consumos ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {
    console.error("❌ ERRO AO BUSCAR:", err);
    res.status(500).json({ erro: "Erro ao buscar" });
  }
});

/**
 * ROTA TESTE
 */
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

/**
 * SERVIDOR
 */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});