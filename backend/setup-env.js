const fs = require('fs');
const path = require('path');

// Configurações
const config = `# =====================================================
# CONFIGURAÇÕES DO AMBIENTE - DOCE SENSACOES
# =====================================================

# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Configurações Google Sheets
GOOGLE_CREDENTIALS_FILE=google-credentials.json
GOOGLE_SHEETS_ID=18dSNYrPRpUdlOWhURS3xahTbdbELyplPSa47aqfIm7w

# Configurações JWT
JWT_SECRET=doce_sensacoes_jwt_secret_key_2024
JWT_EXPIRES_IN=7d

# Configurações de Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app

# Configurações de Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Configurações de Segurança
CORS_ORIGIN=http://localhost:5000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
`;

// Criar arquivo .env
const envPath = path.join(__dirname, '.env');
fs.writeFileSync(envPath, config);

console.log('✅ Arquivo .env criado com sucesso!');
console.log('📋 Configurações:');
console.log('   - ID da Planilha:', '18dSNYrPRpUdlOWhURS3xahTbdbELyplPSa47aqfIm7w');
console.log('   - Arquivo de credenciais:', 'google-credentials.json');
console.log('   - Porta do servidor:', '3001');
console.log('\n🚀 Próximo passo: npm run dev'); 