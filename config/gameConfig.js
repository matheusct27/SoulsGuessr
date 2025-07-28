// Configurações do jogo
module.exports = {
  // Horário do reset diário (formato: 'hora minuto * * *')
  // Exemplo: '0 0 * * *' = meia-noite (00:00)
  // Exemplo: '0 6 * * *' = 6 da manhã (06:00)
  DAILY_RESET_TIME: '0 0 * * *', // Meia-noite por padrão
  
  // Configurações de sessão
  SESSION_SECRET: 'soulsguessr-secret-key-change-in-production',
  SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 24 horas
  
  // Configurações do MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/soulsguessr',
  
  // Configurações do jogo
  MAX_ATTEMPTS_PER_DAY: null, // null = sem limite, número = limite de tentativas
  SHOW_HINTS_AFTER_ATTEMPTS: 3, // Mostrar dicas após N tentativas
  
  // Fuso horário para o reset (opcional)
  TIMEZONE: 'America/Sao_Paulo'
};
