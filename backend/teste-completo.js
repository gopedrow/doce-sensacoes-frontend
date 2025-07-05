#!/usr/bin/env node

/**
 * Teste Completo - Google Sheets Configuration
 * Verifica: planilha, credenciais, API, permissões
 */

const fs = require('fs');
const path = require('path');
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

async function testComplete() {
  logSection('🧪 TESTE COMPLETO - GOOGLE SHEETS');
  
  // 1. Verificar arquivos de configuração
  logSection('1. 📁 Verificando arquivos de configuração');
  
  const files = {
    '.env': fs.existsSync('.env'),
    'google-credentials.json': fs.existsSync('google-credentials.json'),
    'env.example': fs.existsSync('env.example')
  };
  
  Object.entries(files).forEach(([file, exists]) => {
    log(`${exists ? '✅' : '❌'} ${file}`, exists ? 'green' : 'red');
  });
  
  // 2. Verificar credenciais
  logSection('2. 🔑 Verificando credenciais da Service Account');
  
  try {
    const credentials = JSON.parse(fs.readFileSync('google-credentials.json', 'utf8'));
    
    const requiredFields = [
      'type',
      'project_id', 
      'private_key_id',
      'private_key',
      'client_email',
      'client_id'
    ];
    
    requiredFields.forEach(field => {
      const hasField = credentials[field] && credentials[field].length > 0;
      log(`${hasField ? '✅' : '❌'} ${field}`, hasField ? 'green' : 'red');
    });
    
    // Verificar formato da chave privada
    const privateKey = credentials.private_key;
    const hasCorrectFormat = privateKey && 
      privateKey.includes('-----BEGIN PRIVATE KEY-----') &&
      privateKey.includes('-----END PRIVATE KEY-----');
    
    log(`${hasCorrectFormat ? '✅' : '❌'} Formato da chave privada`, hasCorrectFormat ? 'green' : 'red');
    
    if (hasCorrectFormat) {
      log(`   📧 Email: ${credentials.client_email}`, 'blue');
      log(`   🆔 Project ID: ${credentials.project_id}`, 'blue');
    }
    
  } catch (error) {
    log(`❌ Erro ao ler credenciais: ${error.message}`, 'red');
  }
  
  // 3. Testar conexão com Google Sheets
  logSection('3. 🔗 Testando conexão com Google Sheets');
  
  try {
    // Carregar credenciais
    const credentials = JSON.parse(fs.readFileSync('google-credentials.json', 'utf8'));
    
    // Configurar autenticação
    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const sheets = google.sheets({ version: 'v4', auth });
    
    // Tentar listar planilhas (teste básico de API)
    log('🔄 Testando acesso à API...', 'yellow');
    
    // Primeiro, vamos tentar acessar a API sem ID específico
    const authClient = await auth.getClient();
    log('✅ Autenticação com Google API bem-sucedida', 'green');
    
    // Verificar se temos um ID de planilha para testar
    let spreadsheetId = null;
    
    // Tentar ler do .env se existir
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const sheetsIdMatch = envContent.match(/GOOGLE_SHEETS_ID=([^\s]+)/);
      if (sheetsIdMatch) {
        spreadsheetId = sheetsIdMatch[1];
        log(`📋 ID da planilha encontrado: ${spreadsheetId}`, 'blue');
      }
    }
    
    if (spreadsheetId) {
      log('🔄 Testando acesso à planilha específica...', 'yellow');
      
      try {
        const response = await sheets.spreadsheets.get({
          spreadsheetId: spreadsheetId,
        });
        
        log('✅ Planilha encontrada e acessível!', 'green');
        log(`   📊 Título: ${response.data.properties.title}`, 'blue');
        log(`   📋 Abas: ${response.data.sheets.map(s => s.properties.title).join(', ')}`, 'blue');
        
        // Verificar permissões
        log('🔄 Verificando permissões...', 'yellow');
        
        try {
          // Tentar ler uma célula para verificar permissões de leitura
          await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'A1:A1',
          });
          log('✅ Permissão de leitura: OK', 'green');
        } catch (readError) {
          log('❌ Erro na permissão de leitura', 'red');
          log(`   ${readError.message}`, 'red');
        }
        
        try {
          // Tentar escrever uma célula de teste para verificar permissões de escrita
          await sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: 'Z999:Z999', // Célula bem longe
            valueInputOption: 'RAW',
            resource: { values: [['TESTE_PERMISSAO']] },
          });
          log('✅ Permissão de escrita: OK', 'green');
          
          // Limpar o teste
          await sheets.spreadsheets.values.clear({
            spreadsheetId: spreadsheetId,
            range: 'Z999:Z999',
          });
          
        } catch (writeError) {
          log('❌ Erro na permissão de escrita', 'red');
          log(`   ${writeError.message}`, 'red');
        }
        
      } catch (sheetsError) {
        log('❌ Erro ao acessar planilha específica', 'red');
        log(`   ${sheetsError.message}`, 'red');
        
        if (sheetsError.message.includes('notFound')) {
          log('💡 Dica: Verifique se o ID da planilha está correto', 'yellow');
        } else if (sheetsError.message.includes('forbidden')) {
          log('💡 Dica: Verifique se a planilha está compartilhada com a Service Account', 'yellow');
        }
      }
    } else {
      log('⚠️  Nenhum ID de planilha encontrado para teste específico', 'yellow');
      log('💡 Configure GOOGLE_SHEETS_ID no arquivo .env', 'yellow');
    }
    
  } catch (error) {
    log('❌ Erro na conexão com Google Sheets', 'red');
    log(`   ${error.message}`, 'red');
    
    if (error.message.includes('invalid_grant')) {
      log('💡 Dica: Verifique se a Google Sheets API está ativada', 'yellow');
    } else if (error.message.includes('unauthorized')) {
      log('💡 Dica: Verifique as credenciais da Service Account', 'yellow');
    }
  }
  
  // 4. Resumo final
  logSection('4. 📋 RESUMO DOS TESTES');
  
  log('🎯 Para corrigir problemas:', 'bold');
  log('1. Verifique se a Google Sheets API está ativada no Google Cloud Console', 'blue');
  log('2. Confirme se a planilha está compartilhada com a Service Account', 'blue');
  log('3. Verifique se o ID da planilha está correto', 'blue');
  log('4. Confirme se as credenciais estão atualizadas', 'blue');
  
  log('\n🔗 Links úteis:', 'bold');
  log('• Google Cloud Console: https://console.cloud.google.com/', 'blue');
  log('• Google Sheets API: https://console.cloud.google.com/apis/library/sheets.googleapis.com', 'blue');
  log('• Service Accounts: https://console.cloud.google.com/iam-admin/serviceaccounts', 'blue');
  
  log('\n✅ Teste completo finalizado!', 'green');
}

// Executar teste
testComplete().catch(console.error); 