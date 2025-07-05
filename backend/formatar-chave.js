#!/usr/bin/env node

/**
 * Script para formatar a chave privada corretamente para o Render
 * Execute: node formatar-chave.js
 */

const fs = require('fs');

function formatPrivateKey(key) {
  // Remove quebras de linha reais e substitui por \n
  const formatted = key.replace(/\n/g, '\\n');
  
  // Adiciona aspas duplas
  return `"${formatted}"`;
}

function generateRenderConfig() {
  try {
    // Lê o arquivo de credenciais
    const credentials = JSON.parse(fs.readFileSync('google-credentials.json', 'utf8'));
    
    console.log('🔧 FORMATANDO CHAVE PRIVADA PARA O RENDER\n');
    
    // Formata a chave privada
    const formattedKey = formatPrivateKey(credentials.private_key);
    
    console.log('✅ CHAVE PRIVADA FORMATADA:');
    console.log('='.repeat(80));
    console.log(formattedKey);
    console.log('='.repeat(80));
    
    console.log('\n📋 CONFIGURAÇÃO COMPLETA PARA O RENDER:');
    console.log('='.repeat(80));
    console.log(`GOOGLE_SERVICE_ACCOUNT_EMAIL=${credentials.client_email}`);
    console.log(`GOOGLE_PRIVATE_KEY=${formattedKey}`);
    console.log(`GOOGLE_SHEETS_ID=18dSNYrPRpUdlOWhURS3xahTbdbELyplPSa47aqfIm7w`);
    console.log('='.repeat(80));
    
    console.log('\n🎯 INSTRUÇÕES:');
    console.log('1. Copie cada linha acima');
    console.log('2. Cole no Render > Environment > Add Environment Variable');
    console.log('3. Salve as mudanças');
    console.log('4. Aguarde o deploy automático');
    
    // Salva em arquivo para facilitar
    const configContent = `# Configuração para Render
GOOGLE_SERVICE_ACCOUNT_EMAIL=${credentials.client_email}
GOOGLE_PRIVATE_KEY=${formattedKey}
GOOGLE_SHEETS_ID=18dSNYrPRpUdlOWhURS3xahTbdbELyplPSa47aqfIm7w
JWT_SECRET=doce-sensacoes-2024-secret-key
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://seu-frontend.netlify.app
`;

    fs.writeFileSync('render-config.txt', configContent);
    console.log('\n💾 Configuração salva em: render-config.txt');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n💡 Certifique-se de que o arquivo google-credentials.json existe');
  }
}

// Executar
generateRenderConfig(); 