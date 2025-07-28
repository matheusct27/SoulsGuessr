var express = require('express');
var router = express.Router();
const Boss = require('../models/Boss');
const UserAttempt = require('../models/UserAttempt');
const dailyChallengeService = require('../services/DailyChallengeService');

/* Página inicial */
router.get('/', async function(req, res, next) {
  try {
    // Pega o desafio do dia atual
    const currentChallenge = dailyChallengeService.getCurrentChallenge();
    
    if (!currentChallenge) {
      return res.render('error', { 
        message: 'Desafio diário não disponível', 
        error: { status: 500, stack: '' } 
      });
    }

    // Gera ID da sessão se não existir
    if (!req.session.id) {
      req.session.regenerate(() => {});
    }

    // Busca tentativas do usuário para hoje
    const today = dailyChallengeService.getTodayString();
    let userAttempt = await UserAttempt.findOne({ 
      sessionId: req.session.id, 
      date: today 
    }).populate('attempts.bossId');

    // Se não existe, cria novo registro
    if (!userAttempt) {
      userAttempt = new UserAttempt({
        sessionId: req.session.id,
        date: today,
        attempts: [],
        completed: false
      });
      await userAttempt.save();
    }

    // Processa as tentativas existentes para incluir dados de comparação
    const processedAttempts = userAttempt.attempts.map(attempt => {
      if (attempt.bossId) {
        const comparison = dailyChallengeService.compareBossFields(attempt.bossId);
        return {
          ...attempt.toObject(),
          comparison: comparison
        };
      }
      return attempt;
    });

    res.render('index', { 
      currentChallenge,
      userAttempts: processedAttempts,
      completed: userAttempt.completed,
      date: today
    });
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
    // Verifica se o desafio diário está disponível
    const currentChallenge = dailyChallengeService.getCurrentChallenge();
    if (!currentChallenge) {
      return res.json({ error: 'Desafio diário não disponível' });
    }

    // Gera ID da sessão se não existir
    if (!req.session.id) {
      req.session.regenerate(() => {});
    }

    const today = dailyChallengeService.getTodayString();
    
    // Busca tentativas do usuário para hoje
    let userAttempt = await UserAttempt.findOne({ 
      sessionId: req.session.id, 
      date: today 
    });

    // Se já completou o desafio, não permite mais tentativas
    if (userAttempt && userAttempt.completed) {
      return res.json({ 
        completed: true, 
        message: 'Você já completou o desafio de hoje! Volte amanhã.' 
      });
    }

    // Busca o boss chutado
    const bossChutado = await Boss.findOne({ 
      nome: new RegExp('^' + nome + '$', 'i') 
    });
    
    if (!bossChutado) {
      return res.json({ found: false });
    }

    // Cria registro de tentativa se não existe
    if (!userAttempt) {
      userAttempt = new UserAttempt({
        sessionId: req.session.id,
        date: today,
        attempts: [],
        completed: false
      });
    }

    // Verifica se já tentou este boss hoje
    const alreadyTried = userAttempt.attempts.some(attempt => 
      attempt.bossId.toString() === bossChutado._id.toString()
    );

    if (alreadyTried) {
      return res.json({ 
        alreadyTried: true, 
        message: 'Você já tentou este boss hoje!' 
      });
    }

    // Compara com o boss do dia
    const tentativa = dailyChallengeService.compareBossFields(bossChutado);
    
    // Adiciona a tentativa ao registro do usuário
    userAttempt.attempts.push({
      bossId: bossChutado._id,
      isCorrect: tentativa.isCorrect
    });

    // Se acertou, marca como completado
    if (tentativa.isCorrect) {
      userAttempt.completed = true;
      userAttempt.completedAt = new Date();
    }

    await userAttempt.save();

    res.json({ 
      found: true, 
      tentativa,
      completed: userAttempt.completed,
      totalAttempts: userAttempt.attempts.length
    });
    
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

// Rota para obter estatísticas do jogador
router.get('/stats', async function(req, res, next) {
  try {
    if (!req.session.id) {
      return res.json({ attempts: [], totalGames: 0, wins: 0 });
    }

    const userAttempts = await UserAttempt.find({ 
      sessionId: req.session.id 
    }).sort({ date: -1 }).limit(30); // Últimos 30 dias

    const stats = {
      totalGames: userAttempts.length,
      wins: userAttempts.filter(attempt => attempt.completed).length,
      currentStreak: 0,
      bestStreak: 0,
      averageAttempts: 0,
      recentGames: userAttempts.slice(0, 7) // 7 jogos mais recentes
    };

    // Calcula streak atual e melhor
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < userAttempts.length; i++) {
      if (userAttempts[i].completed) {
        tempStreak++;
        if (i === 0) currentStreak = tempStreak;
      } else {
        if (i === 0) currentStreak = 0;
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 0;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    stats.currentStreak = currentStreak;
    stats.bestStreak = bestStreak;

    // Calcula média de tentativas para jogos completados
    const completedGames = userAttempts.filter(attempt => attempt.completed);
    if (completedGames.length > 0) {
      const totalAttempts = completedGames.reduce((sum, game) => sum + game.attempts.length, 0);
      stats.averageAttempts = (totalAttempts / completedGames.length).toFixed(1);
    }

    res.json(stats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
