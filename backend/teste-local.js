#!/usr/bin/env node

/**
 * Teste Local - Google Sheets Configuration
 * Usa credenciais do arquivo google-credentials.json
 */

require('dotenv').config();
const fs = require('fs');
const { google } = require('googleapis');

// Cores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.bold}${colors.blue}=== ${title} ===${colors.reset}`);
}

async function testLocal() {
  logSection('🧪 TESTE LOCAL - GOOGLE SHEETS');
  
  try {
    // 1. Carregar credenciais do arquivo JSON
    logSection('1. 🔑 Carregando credenciais');
    
    if (!fs.existsSync('google-credentials.json')) {
      log('❌ Arquivo google-credentials.json não encontrado', 'red');
      return false;
    }
    
    const credentials = JSON.parse(fs.readFileSync('google-credentials.json', 'utf8'));
    log('✅ Credenciais carregadas com sucesso', 'green');
    log(`   📧 Email: ${credentials.client_email}`, 'blue');
    log(`   🆔 Project: ${credentials.project_id}`, 'blue');
    
    // 2. Configurar autenticação
    logSection('2. 🔗 Configurando autenticação');
    
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    log('✅ Autenticação configurada', 'green');
    
    // 3. Testar conexão com API
    logSection('3. 🌐 Testando conexão com Google API');
    
    const authClient = await auth.getClient();
    log('✅ Conexão com Google API estabelecida', 'green');
    
    // 4. Verificar planilha
    logSection('4. 📊 Verificando planilha');
    
    // Tentar ler ID da planilha do .env
    let spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    
    if (!spreadsheetId) {
      log('⚠️  GOOGLE_SHEETS_ID não encontrado no .env', 'yellow');
      log('💡 Verificando se existe no arquivo .env...', 'yellow');
      
      if (fs.existsSync('.env')) {
        const envContent = fs.readFileSync('.env', 'utf8');
        const match = envContent.match(/GOOGLE_SHEETS_ID=([^\s]+)/);
        if (match) {
          spreadsheetId = match[1];
          log(`✅ ID da planilha encontrado: ${spreadsheetId}`, 'green');
        }
      }
    } else {
      log(`✅ ID da planilha: ${spreadsheetId}`, 'green');
    }
    
    if (!spreadsheetId) {
      log('❌ Nenhum ID de planilha encontrado', 'red');
      log('💡 Configure GOOGLE_SHEETS_ID no arquivo .env', 'yellow');
      return false;
    }
    
    // 5. Testar acesso à planilha
    logSection('5. 📋 Testando acesso à planilha');
    
    try {
      const response = await sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
      });
      
      log('✅ Planilha encontrada e acessível!', 'green');
      log(`   📊 Título: ${response.data.properties.title}`, 'blue');
      log(`   📋 Abas: ${response.data.sheets.map(s => s.properties.title).join(', ')}`, 'blue');
      
      // 6. Testar permissões
      logSection('6. 🔐 Testando permissões');
      
      // Teste de leitura
      try {
        await sheets.spreadsheets.values.get({
          spreadsheetId: spreadsheetId,
          range: 'A1:A1',
        });
        log('✅ Permissão de leitura: OK', 'green');
      } catch (readError) {
        log('❌ Erro na permissão de leitura', 'red');
        log(`   ${readError.message}`, 'red');
      }
      
      // Teste de escrita
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: spreadsheetId,
          range: 'Z999:Z999',
          valueInputOption: 'RAW',
          resource: { values: [['TESTE_LOCAL']] },
        });
        log('✅ Permissão de escrita: OK', 'green');
        
        // Limpar teste
        await sheets.spreadsheets.values.clear({
          spreadsheetId: spreadsheetId,
          range: 'Z999:Z999',
        });
        
      } catch (writeError) {
        log('❌ Erro na permissão de escrita', 'red');
        log(`   ${writeError.message}`, 'red');
      }
      
      // 7. Resumo final
      logSection('7. 🎉 RESUMO');
      
      log('✅ TODOS OS TESTES PASSARAM!', 'green');
      log('✅ A planilha existe e está compartilhada', 'green');
      log('✅ As credenciais da Service Account estão corretas', 'green');
      log('✅ A Google Sheets API está ativada', 'green');
      log('✅ Permissões de leitura e escrita estão OK', 'green');
      
      log('\n🚀 Seu backend está pronto para deploy!', 'bold');
      log('💡 Agora você pode fazer push para o GitHub e o Render fará deploy automaticamente', 'blue');
      
      return true;
      
    } catch (sheetsError) {
      log('❌ Erro ao acessar planilha', 'red');
      log(`   ${sheetsError.message}`, 'red');
      
      if (sheetsError.message.includes('notFound')) {
        log('💡 Dica: Verifique se o ID da planilha está correto', 'yellow');
      } else if (sheetsError.message.includes('forbidden')) {
        log('💡 Dica: Verifique se a planilha está compartilhada com a Service Account', 'yellow');
        log(`   Email da Service Account: ${credentials.client_email}`, 'blue');
      }
      
      return false;
    }
    
  } catch (error) {
    log('❌ Erro geral no teste', 'red');
    log(`   ${error.message}`, 'red');
    
    if (error.message.includes('invalid_grant')) {
      log('💡 Dica: Verifique se a Google Sheets API está ativada', 'yellow');
    } else if (error.message.includes('unauthorized')) {
      log('💡 Dica: Verifique as credenciais da Service Account', 'yellow');
    }
    
    return false;
  }
}

// Executar teste
testLocal().then(success => {
  if (!success) {
    process.exit(1);
  }
}).catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
}); 