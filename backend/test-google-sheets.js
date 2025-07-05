#!/usr/bin/env node

/**
 * Script para testar configuração do Google Sheets
 * Execute: node test-google-sheets.js
 */

require('dotenv').config();
const { testConnection } = require('./src/config/googleSheets');

async function testGoogleSheetsConfig() {
  console.log('🧪 Testando configuração do Google Sheets...\n');
  
  // Verificar variáveis de ambiente
  console.log('📋 Verificando variáveis de ambiente:');
  console.log(`   GOOGLE_SHEETS_ID: ${process.env.GOOGLE_SHEETS_ID ? '✅ Definida' : '❌ Não definida'}`);
  console.log(`   GOOGLE_SERVICE_ACCOUNT_EMAIL: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Definida' : '❌ Não definida'}`);
  console.log(`   GOOGLE_PRIVATE_KEY: ${process.env.GOOGLE_PRIVATE_KEY ? '✅ Definida' : '❌ Não definida'}`);
  
  if (!process.env.GOOGLE_SHEETS_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    console.log('\n❌ Algumas variáveis de ambiente estão faltando!');
    console.log('💡 Verifique seu arquivo .env');
    process.exit(1);
  }
  
  console.log('\n🔍 Testando conexão com Google Sheets...');
  
  try {
    const connected = await testConnection();
    
    if (connected) {
      console.log('\n🎉 Configuração está correta!');
      console.log('✅ Você pode fazer o deploy com segurança');
    } else {
      console.log('\n❌ Falha na conexão');
      console.log('💡 Verifique as dicas acima e tente novamente');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Erro durante o teste:', error.message);
    process.exit(1);
  }
}

// Executar teste
testGoogleSheetsConfig(); 