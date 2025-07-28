const mongoose = require('../db');

const BossSchema = new mongoose.Schema({
  nome: String,
  jogo: String,
  fraqueza: String,
  local: String,
  hp: Number,
  imagem: String
});

// Força o nome da coleção para "Boss"
module.exports = mongoose.model('Boss', BossSchema, 'Boss');