const mongoose = require('../db');
const Boss = require('../models/Boss');

// Dados de exemplo de bosses
const bosses = [
  {
    nome: "Artorias of the Abyss",
    jogo: "Dark Souls",
    fraqueza: "Fogo",
    local: "Oolacile Township",
    hp: 3750,
    imagem: "/images/bosses/artorias.jpg"
  },
  {
    nome: "Ornstein and Smough",
    jogo: "Dark Souls",
    fraqueza: "Fogo",
    local: "Anor Londo",
    hp: 4200,
    imagem: "/images/bosses/ornstein_smough.jpg"
  },
  {
    nome: "Gwyn, Lord of Cinder",
    jogo: "Dark Souls",
    fraqueza: "Nenhuma",
    local: "Kiln of the First Flame",
    hp: 4250,
    imagem: "/images/bosses/gwyn.jpg"
  },
  {
    nome: "Soul of Cinder",
    jogo: "Dark Souls III",
    fraqueza: "Frost",
    local: "Kiln of the First Flame",
    hp: 4500,
    imagem: "/images/bosses/soul_of_cinder.jpg"
  },
  {
    nome: "Margit, the Fell Omen",
    jogo: "Elden Ring",
    fraqueza: "Sangramento",
    local: "Stormgate",
    hp: 4174,
    imagem: "/images/bosses/margit.jpg"
  },
  {
    nome: "Malenia, Blade of Miquella",
    jogo: "Elden Ring",
    fraqueza: "Frost",
    local: "Haligtree",
    hp: 18500,
    imagem: "/images/bosses/malenia.jpg"
  },
  {
    nome: "Genichiro Ashina",
    jogo: "Sekiro",
    fraqueza: "Nenhuma",
    local: "Ashina Reservoir",
    hp: 17000,
    imagem: "/images/bosses/genichiro.jpg"
  },
  {
    nome: "Guardian Ape",
    jogo: "Sekiro",
    fraqueza: "Fogo",
    local: "Sunken Valley",
    hp: 12000,
    imagem: "/images/bosses/guardian_ape.jpg"
  }
];

async function seedBosses() {
  try {
    // Verifica se já existem bosses no banco
    const existingBosses = await Boss.countDocuments();
    
    if (existingBosses === 0) {
      console.log('Inserindo bosses de exemplo no banco de dados...');
      await Boss.insertMany(bosses);
      console.log(`${bosses.length} bosses inseridos com sucesso!`);
    } else {
      console.log(`${existingBosses} bosses já existem no banco de dados.`);
    }
  } catch (error) {
    console.error('Erro ao inserir bosses:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Executa o seeding
seedBosses();
