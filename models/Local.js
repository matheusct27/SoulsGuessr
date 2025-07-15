const mongoose = require('../db');

const BossSchema = new mongoose.Schema({
  nome: String,
  jogo: String,
  tipo: String,
  local: String,
  hp: Number,
  imagem: String
});

module.exports = mongoose.model('Boss', BossSchema);