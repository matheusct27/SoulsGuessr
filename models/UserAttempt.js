const mongoose = require('../db');

const UserAttemptSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  attempts: [{
    bossId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Boss'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
});

// Índice composto para busca rápida
UserAttemptSchema.index({ sessionId: 1, date: 1 });

module.exports = mongoose.model('UserAttempt', UserAttemptSchema);
