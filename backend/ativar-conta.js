// Script para ativar conta da Ligia
const { google } = require('googleapis');
require('dotenv').config();

// Função para processar a chave privada
function processPrivateKey(privateKey) {
  if (!privateKey) {
    throw new Error('GOOGLE_PRIVATE_KEY não está definida');
  }
  let processedKey = privateKey.replace(/^["']|["']$/g, '');
  if (processedKey.includes('\n')) {
    return processedKey;
  }
  processedKey = processedKey.replace(/\\n/g, '\n');
  return processedKey;
}

// Carregar credenciais
function loadCredentials() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Credenciais não encontradas');
  }
  
  return {
    type: 'service_account',
    project_id: 'doce-sensacoes-backend',
    private_key_id: '1d3699a668c58cc12ddb24842f774ed63cb0230a',
    private_key: processPrivateKey(process.env.GOOGLE_PRIVATE_KEY),
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    client_id: '103598523462427861445',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL)}`,
    universe_domain: 'googleapis.com'
  };
}

// Configuração
const credentials = loadCredentials();
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

async function ativarContaLigia() {
  try {
    console.log('🔍 Procurando conta da Ligia...');
    
    // Ler todos os usuários
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'users!A:L',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('❌ Nenhum usuário encontrado');
      return;
    }

    const headers = rows[0];
    const users = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || null;
      });
      return obj;
    });

    // Procurar pela Ligia
    const ligia = users.find(user => user.email === 'ligia@docesensacoes.com');
    
    if (!ligia) {
      console.log('❌ Conta da Ligia não encontrada');
      return;
    }

    console.log('✅ Conta encontrada:', {
      id: ligia.id,
      name: ligia.name,
      email: ligia.email,
      is_active: ligia.is_active
    });

    if (ligia.is_active === 'TRUE') {
      console.log('ℹ️ Conta já está ativa');
      return;
    }

    // Ativar a conta
    console.log('🔄 Ativando conta...');
    
    // Encontrar a linha da Ligia
    const ligiaRowIndex = users.findIndex(user => user.email === 'ligia@docesensacoes.com') + 2; // +2 porque começamos do índice 0 e pulamos o header
    
    // Atualizar o campo is_active
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `users!K${ligiaRowIndex}`,
      valueInputOption: 'RAW',
      resource: {
        values: [['TRUE']]
      }
    });

    console.log('✅ Conta ativada com sucesso!');
    console.log('🔑 Agora você pode fazer login com:');
    console.log('   Email: ligia@docesensacoes.com');
    console.log('   Senha: 841518');
    
  } catch (error) {
    console.error('❌ Erro ao ativar conta:', error);
  }
}

// Executar
ativarContaLigia(); 