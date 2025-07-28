const mongoose = require('../db');

const DailyChallengeSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true // Garante que só existe um desafio por dia
  },
  bossId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Boss',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DailyChallenge', DailyChallengeSchema);
