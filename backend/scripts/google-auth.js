#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🍰 Configuração do Google Sheets - Doce Sensações\n');

console.log('📋 Este script vai te ajudar a configurar a autenticação do Google Sheets.\n');

console.log('🔧 Passos necessários:');
console.log('1. Acesse: https://console.cloud.google.com/');
console.log('2. Crie um novo projeto ou selecione existente');
console.log('3. Ative a Google Sheets API');
console.log('4. Crie uma Service Account');
console.log('5. Baixe o arquivo JSON de credenciais');
console.log('6. Crie uma planilha no Google Sheets');
console.log('7. Compartilhe a planilha com o email da Service Account\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupGoogleAuth() {
  try {
    // Perguntar se já tem as credenciais
    const hasCredentials = await askQuestion('Você já tem o arquivo JSON de credenciais da Service Account? (s/n): ');
    
    if (hasCredentials.toLowerCase() === 's' || hasCredentials.toLowerCase() === 'sim') {
      const credentialsPath = await askQuestion('Digite o caminho completo para o arquivo JSON: ');
      
      if (!fs.existsSync(credentialsPath)) {
        console.log('❌ Arquivo não encontrado. Verifique o caminho.');
        rl.close();
        return;
      }

      // Ler arquivo de credenciais
      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      
      // Extrair informações necessárias
      const serviceAccountEmail = credentials.client_email;
      const privateKey = credentials.private_key;

      // Perguntar ID da planilha
      const spreadsheetId = await askQuestion('Digite o ID da planilha (da URL do Google Sheets): ');
      
      // Criar arquivo .env
      const envPath = path.join(__dirname, '..', '.env');
      const envContent = `# =====================================================
# CONFIGURAÇÕES DO AMBIENTE - DOCE SENSACOES (GOOGLE SHEETS)
# =====================================================

# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações Google Sheets
GOOGLE_SHEETS_ID=${spreadsheetId}
GOOGLE_SERVICE_ACCOUNT_EMAIL=${serviceAccountEmail}
GOOGLE_PRIVATE_KEY="${privateKey}"

# Configurações JWT
JWT_SECRET=${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
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

      fs.writeFileSync(envPath, envContent);
      
      console.log('\n✅ Arquivo .env criado com sucesso!');
      console.log('🔐 Credenciais do Google Sheets configuradas');
      console.log('📊 ID da planilha configurado');
      console.log('🔑 Chave JWT gerada automaticamente');
      
    } else {
      console.log('\n📚 Guia completo para configurar Google Sheets:');
      console.log('\n1. Acesse https://console.cloud.google.com/');
      console.log('2. Crie um novo projeto ou selecione existente');
      console.log('3. No menu lateral, vá em "APIs e serviços" > "Biblioteca"');
      console.log('4. Procure por "Google Sheets API" e ative');
      console.log('5. Vá em "APIs e serviços" > "Credenciais"');
      console.log('6. Clique em "Criar credenciais" > "Conta de serviço"');
      console.log('7. Preencha os dados e clique em "Criar"');
      console.log('8. Clique na conta de serviço criada');
      console.log('9. Vá na aba "Chaves" > "Adicionar chave" > "Criar nova chave"');
      console.log('10. Escolha JSON e baixe o arquivo');
      console.log('11. Crie uma planilha no Google Sheets');
      console.log('12. Compartilhe a planilha com o email da Service Account (com permissão de editor)');
      console.log('13. Copie o ID da planilha da URL (parte entre /d/ e /edit)');
      console.log('14. Execute este script novamente com as credenciais\n');
    }

    console.log('\n📋 Próximos passos:');
    console.log('1. Execute: npm install');
    console.log('2. Execute: npm run dev');
    console.log('3. Teste a conexão: http://localhost:3000/health');
    console.log('\n🍰 Configuração concluída!');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error.message);
  } finally {
    rl.close();
  }
}

setupGoogleAuth(); 