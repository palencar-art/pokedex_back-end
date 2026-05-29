const express = require("express");
const cors = require("cors");
const app = express();
const porta = 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Nosso Banco em Memória
let colecaoCartas = [
  { id: 1, nome: "Charizard", expansao: "Phantalmal Flames", hp: 150 },
  { id: 2, nome: "Blastoise", expansao: "Base Set", hp: 100 },
];

// Rota 1: Lista tudo
app.get("/cartas", (req, res) => {
  res.status(200).json(colecaoCartas);
});

// Rota 2: Cadastra nova carta
app.post("/cartas/nova", (req, res) => {
  let { nome, expansao, hp } = req.body;
  hp = parseInt(hp);

  // Validação de Segurança
  if (!nome || !expansao || !hp || hp <= 0) {
    return res
      .status(400)
      .json({ erro: "Dados inválidos! O HP deve ser maior que zero." });
  }

  let novaCarta = {
    id: colecaoCartas.length + 1,
    nome: nome,
    expansao: expansao,
    hp: hp,
  };

  colecaoCartas.push(novaCarta);

  res.status(201).json({
    mensagem: "Carta adicionada à coleção com sucesso!",
    carta: novaCarta,
  });
});

// Rota 3: Busca Dinâmica com req.params
app.get("/cartas/:id", (req, res) => {
  let idBuscado = parseInt(req.params.id);

  // O clássico .find() do JavaScript
  let cartaEncontrada = colecaoCartas.find((c) => c.id === idBuscado);

  // Validação do 404 (Not Found)
  if (!cartaEncontrada) {
    return res.status(404).json({ erro: "Carta não encontrada na coleção." });
  }

  res.status(200).json(cartaEncontrada);
});

app.listen(porta, () => {
  console.log(`Catálogo rodando na porta ${porta}`);
});

app.delete("/cartas/delete", (req, res) => {
  let idDelete = parseInt(req.body.id);
  let indexCarta = colecaoCartas.findIndex((carta) => carta.id === idDelete);

  if (indexCarta === -1) {
    return res.status(404).json({
      status: false,
      mensagem: "Carta Inexistente",
    });
  }
  colecaoCartas.splice(indexCarta,1); 
  res.status(200).json({
    mensagem: "Carta deletada com sucesso", indexCarta
  })
});