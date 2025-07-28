const cron = require('node-cron');
const DailyChallenge = require('../models/DailyChallenge');
const Boss = require('../models/Boss');
const config = require('../config/gameConfig');

class DailyChallengeService {
  constructor() {
    this.currentChallenge = null;
    this.initializeChallenge();
    this.scheduleDailyReset();
  }

  // Inicializa o desafio do dia atual
  async initializeChallenge() {
    try {
      const today = this.getTodayString();
      let challenge = await DailyChallenge.findOne({ date: today })
        .populate('bossId');

      if (!challenge) {
        // Se não existe desafio para hoje, cria um novo
        challenge = await this.createNewChallenge(today);
      }

      this.currentChallenge = challenge;
      console.log(`Desafio do dia ${today} carregado:`, challenge.bossId.nome);
    } catch (error) {
      console.error('Erro ao inicializar desafio diário:', error);
    }
  }

  // Cria um novo desafio para o dia
  async createNewChallenge(date) {
    try {
      // Seleciona um boss aleatório
      const bossCount = await Boss.countDocuments();
      const randomBossSkip = Math.floor(Math.random() * bossCount);
      const selectedBoss = await Boss.findOne().skip(randomBossSkip);

      const newChallenge = new DailyChallenge({
        date: date,
        bossId: selectedBoss._id
      });

      await newChallenge.save();
      
      // Popula os dados para retorno
      await newChallenge.populate('bossId');

      console.log(`Novo desafio criado para ${date}:`, selectedBoss.nome);
      return newChallenge;
    } catch (error) {
      console.error('Erro ao criar novo desafio:', error);
      throw error;
    }
  }

  // Programa o reset diário baseado na configuração
  scheduleDailyReset() {
    // Reset diário baseado na configuração
    cron.schedule(config.DAILY_RESET_TIME, async () => {
      console.log('Executando reset diário...');
      await this.initializeChallenge();
    }, {
      timezone: config.TIMEZONE
    });

    console.log(`Agendamento de reset diário configurado para: ${config.DAILY_RESET_TIME} (${config.TIMEZONE})`);
  }

  // Retorna o desafio atual
  getCurrentChallenge() {
    return this.currentChallenge;
  }

  // Gera string da data atual no formato YYYY-MM-DD
  getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Verifica se o chute está correto
  checkGuess(guessedBoss) {
    if (!this.currentChallenge || !guessedBoss) {
      return false;
    }

    return guessedBoss._id.toString() === this.currentChallenge.bossId._id.toString();
  }

  // Compara campos entre o boss chutado e o boss do dia
  compareBossFields(guessedBoss) {
    const targetBoss = this.currentChallenge.bossId;

    function comparaCampo(valorChute, valorDia) {
      if (valorChute === valorDia) return 'correto';
      if (
        typeof valorChute === 'string' &&
        typeof valorDia === 'string' &&
        (valorChute.toLowerCase().includes(valorDia.toLowerCase()) ||
         valorDia.toLowerCase().includes(valorChute.toLowerCase()))
      ) return 'parcial';
      return 'incorreto';
    }

    return {
      nome: guessedBoss.nome,
      nomeStatus: comparaCampo(guessedBoss.nome, targetBoss.nome),
      jogo: guessedBoss.jogo,
      jogoStatus: comparaCampo(guessedBoss.jogo, targetBoss.jogo),
      fraqueza: guessedBoss.fraqueza,
      fraquezaStatus: comparaCampo(guessedBoss.fraqueza, targetBoss.fraqueza),
      local: guessedBoss.local,
      localStatus: comparaCampo(guessedBoss.local, targetBoss.local),
      hp: guessedBoss.hp,
      hpStatus: guessedBoss.hp === targetBoss.hp ? 'correto' : 'incorreto',
      isCorrect: this.checkGuess(guessedBoss)
    };
  }
}

module.exports = new DailyChallengeService();
