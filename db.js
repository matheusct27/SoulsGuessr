const mongoose = require('mongoose');
const config = require('./config/gameConfig');

mongoose.connect(config.MONGODB_URI);

// Event listeners para conexão
mongoose.connection.on('connected', () => {
  console.log('Conectado ao MongoDB:', config.MONGODB_URI);
});

mongoose.connection.on('error', (err) => {
  console.error('Erro na conexão MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Desconectado do MongoDB');
});

module.exports = mongoose;