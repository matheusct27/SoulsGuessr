var express = require('express');
var router = express.Router();
const Boss = require('../models/Boss'); // ADICIONE ESTA LINHA

let bossDoDia = null;

// Carrega o boss do dia como Artorias ao iniciar o servidor
Boss.findOne({ nome: /artorias/i }).then(boss => { bossDoDia = boss; });

/* Página inicial */
router.get('/', async function(req, res, next) {
  try {
    const count = await Boss.countDocuments();
    const random = Math.floor(Math.random() * count);
    const boss = await Boss.findOne().skip(random);
    res.render('index', { boss }); // ENVIA O BOSS PARA A VIEW
  } catch (err) {
    next(err);
  }
});

/* Página de regras */
router.get('/regras', function(req, res, next) {
  res.render('regras');
});

/* Página de bosses */
router.get('/bosses', function(req, res, next) {
  res.render('bosses');
});

/* Página sobre */
router.get('/sobre', function(req, res, next) {
  res.render('sobre');
});

/* Rota para processar o chute */
router.post('/chute', async function(req, res, next) {
  const { nome } = req.body;
  try {
    const bossChutado = await Boss.findOne({ nome: new RegExp('^' + nome + '$', 'i') });
    if (!bossChutado) {
      return res.json({ found: false });
    }
    // Comparação dos campos
    function comparaCampo(valorChute, valorDia) {
      if (valorChute === valorDia) return 'correto';
      if (
        typeof valorChute === 'string' &&
        typeof valorDia === 'string' &&
        valorChute.toLowerCase().includes(valorDia.toLowerCase()) ||
        valorDia.toLowerCase().includes(valorChute.toLowerCase())
      ) return 'parcial';
      return 'incorreto';
    }

    const tentativa = {
      nome: bossChutado.nome,
      nomeStatus: comparaCampo(bossChutado.nome, bossDoDia.nome),
      jogo: bossChutado.jogo,
      jogoStatus: comparaCampo(bossChutado.jogo, bossDoDia.jogo),
      tipo: bossChutado.tipo,
      tipoStatus: comparaCampo(bossChutado.tipo, bossDoDia.tipo),
      local: bossChutado.local,
      localStatus: comparaCampo(bossChutado.local, bossDoDia.local),
      hp: bossChutado.hp,
      hpStatus: bossChutado.hp === bossDoDia.hp ? 'correto' : 'incorreto'
    };

    res.json({ found: true, tentativa });
  } catch (err) {
    next(err);
  }
});

// Rota para autocomplete de bosses
router.get('/autocomplete', async function(req, res, next) {
  const termo = req.query.q || '';
  try {
    // Busca bosses que contenham o termo no nome (case-insensitive)
    const resultados = await Boss.find({ nome: new RegExp(termo, 'i') }).limit(5);
    // Retorna apenas nome e imagem
    res.json(resultados.map(boss => ({
      nome: boss.nome,
      imagem: boss.imagem
    })));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
