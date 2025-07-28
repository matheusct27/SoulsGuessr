# SoulsGuessr - Jogo de Adivinhação Diária

Um jogo de adivinhação diária inspirado no Onepiecedle, onde os jogadores tentam adivinhar bosses/personagens de jogos da série Souls (Dark Souls, Elden Ring, Sekiro, etc.).

## 🎮 Como Funciona

- **Desafio Diário**: A cada dia, um novo boss é selecionado aleatoriamente
- **Reset Automático**: O jogo reseta automaticamente à meia-noite (configurável)
- **Sistema de Tentativas**: Jogadores podem fazer múltiplas tentativas até acertar
- **Feedback Visual**: Cores indicam se os atributos estão corretos, parcialmente corretos ou incorretos
- **Estatísticas**: Acompanhe seu desempenho ao longo do tempo

## 🛠 Instalação

### Pré-requisitos
- Node.js (versão 14 ou superior)
- MongoDB (local ou na nuvem)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd SoulsGuessr-main
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o MongoDB**
   - Certifique-se de que o MongoDB está rodando na porta padrão (27017)
   - Ou configure a URL no arquivo `config/gameConfig.js`

4. **Popule o banco com dados de exemplo**
   ```bash
   node scripts/seedBosses.js
   ```

5. **Inicie o servidor**
   ```bash
   npm start
   ```

6. **Acesse o jogo**
   - Abra o navegador em: `http://localhost:3000`

### Instalação Rápida (Windows)
Execute o arquivo `install.bat` para fazer tudo automaticamente.

## ⚙️ Configuração

Edite o arquivo `config/gameConfig.js` para personalizar:

- **Horário do Reset**: Modifique `DAILY_RESET_TIME`
  - `'0 0 * * *'` = Meia-noite (padrão)
  - `'0 6 * * *'` = 6 da manhã
  - `'0 18 * * *'` = 6 da tarde

- **Fuso Horário**: Modifique `TIMEZONE`
  - `'America/Sao_Paulo'` (padrão)
  - `'America/New_York'`
  - `'Europe/London'`

- **URL do MongoDB**: Modifique `MONGODB_URI`

## 🎯 Funcionalidades

### ✅ Implementado
- [x] Sistema de desafio diário
- [x] Reset automático configurável
- [x] Controle de sessões de usuário
- [x] Sistema de tentativas com histórico
- [x] Prevenção de tentativas duplicadas
- [x] Comparação inteligente de atributos
- [x] Autocomplete para busca de bosses
- [x] Estatísticas básicas do jogador

### 🔄 Estrutura do Banco
- **DailyChallenge**: Controla o desafio de cada dia
- **UserAttempt**: Armazena tentativas dos usuários por sessão
- **Boss**: Dados dos bosses (nome, jogo, tipo, local, HP, imagem)
- **Arma**: Dados das armas (preparado para expansão futura)

## 🎨 Como Personalizar

### Adicionar Novos Bosses
1. Adicione os dados no arquivo `scripts/seedBosses.js`
2. Execute: `node scripts/seedBosses.js`

### Modificar Campos de Comparação
Edite a função `compareBossFields` em `services/DailyChallengeService.js`

### Alterar Horário de Reset
Modifique `DAILY_RESET_TIME` em `config/gameConfig.js` usando formato cron:
- `'0 0 * * *'` = Meia-noite
- `'30 23 * * *'` = 23:30
- `'0 */6 * * *'` = A cada 6 horas

## 🐛 Solução de Problemas

### MongoDB não conecta
- Verifique se o MongoDB está rodando
- Confirme a URL em `config/gameConfig.js`
- Para MongoDB Atlas (nuvem), use a string de conexão completa

### Desafio não aparece
- Execute `node scripts/seedBosses.js` para adicionar dados
- Reinicie o servidor
- Verifique logs no console

### Sessões não funcionam
- Certifique-se de que os cookies estão habilitados
- Verifique se `SESSION_SECRET` está configurado

## 📝 Scripts Úteis

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Popular banco com dados
node scripts/seedBosses.js

# Verificar logs
# (Os logs aparecem no console quando o servidor está rodando)
```

## 🔧 Tecnologias Utilizadas

- **Backend**: Node.js, Express.js
- **Banco de Dados**: MongoDB, Mongoose
- **Template Engine**: EJS
- **Sessões**: Express-Session
- **Agendamento**: Node-Cron
- **Frontend**: HTML, CSS, JavaScript (vanilla)

## 📈 Próximas Funcionalidades

- [ ] Sistema de ranking global
- [ ] Modo de jogo com armas
- [ ] Dicas progressivas
- [ ] Compartilhamento de resultados
- [ ] Modo hardcore (tentativas limitadas)
- [ ] Temas diferentes (bosses por jogo)

---

**Desenvolvido para fãs da série Souls** 🔥