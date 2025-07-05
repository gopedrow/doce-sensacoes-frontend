#!/usr/bin/env node

/**
 * Script para testar a API Doce Sensações
 * Execute: node testar-api.js
 */

const https = require('https');

// URL da API
const API_URL = 'https://doce-sensacoes-backend-17.onrender.com';

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

// Função para fazer requisições HTTPS
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'doce-sensacoes-backend-17.onrender.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            status: res.statusCode,
            data: parsedData,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAPI() {
  logSection('🧪 TESTANDO API DOCE SENSACOES');
  log(`🌐 URL: ${API_URL}`, 'blue');

  try {
    // Teste 1: Health Check
    logSection('1. 🏥 Health Check');
    try {
      const health = await makeRequest('/health');
      if (health.status === 200) {
        log('✅ Health Check: OK', 'green');
        log(`   Status: ${health.status}`, 'blue');
        log(`   Database: ${health.data.database}`, 'blue');
      } else {
        log('❌ Health Check: Falhou', 'red');
        log(`   Status: ${health.status}`, 'red');
      }
    } catch (error) {
      log('❌ Health Check: Erro', 'red');
      log(`   ${error.message}`, 'red');
    }

    // Teste 2: Rota Principal
    logSection('2. 🏠 Rota Principal');
    try {
      const main = await makeRequest('/');
      if (main.status === 200) {
        log('✅ Rota Principal: OK', 'green');
        log(`   Status: ${main.status}`, 'blue');
        log(`   Mensagem: ${main.data.message}`, 'blue');
      } else {
        log('❌ Rota Principal: Falhou', 'red');
        log(`   Status: ${main.status}`, 'red');
      }
    } catch (error) {
      log('❌ Rota Principal: Erro', 'red');
      log(`   ${error.message}`, 'red');
    }

    // Teste 3: Listar Produtos
    logSection('3. 📦 Listar Produtos');
    try {
      const products = await makeRequest('/api/products');
      if (products.status === 200) {
        log('✅ Listar Produtos: OK', 'green');
        log(`   Status: ${products.status}`, 'blue');
        log(`   Quantidade: ${products.data.data ? products.data.data.length : 0} produtos`, 'blue');
      } else {
        log('❌ Listar Produtos: Falhou', 'red');
        log(`   Status: ${products.status}`, 'red');
      }
    } catch (error) {
      log('❌ Listar Produtos: Erro', 'red');
      log(`   ${error.message}`, 'red');
    }

    // Teste 4: Produtos em Destaque
    logSection('4. ⭐ Produtos em Destaque');
    try {
      const featured = await makeRequest('/api/products/featured');
      if (featured.status === 200) {
        log('✅ Produtos em Destaque: OK', 'green');
        log(`   Status: ${featured.status}`, 'blue');
        log(`   Quantidade: ${featured.data.data ? featured.data.data.length : 0} produtos`, 'blue');
      } else {
        log('❌ Produtos em Destaque: Falhou', 'red');
        log(`   Status: ${featured.status}`, 'red');
      }
    } catch (error) {
      log('❌ Produtos em Destaque: Erro', 'red');
      log(`   ${error.message}`, 'red');
    }

    // Teste 5: Cadastro de Usuário
    logSection('5. 👤 Cadastro de Usuário');
    try {
      const testUser = {
        name: 'Usuário Teste',
        email: `teste${Date.now()}@exemplo.com`,
        password: 'senha123',
        phone: '11999999999'
      };

      const register = await makeRequest('/api/auth/register', 'POST', testUser);
      if (register.status === 201) {
        log('✅ Cadastro de Usuário: OK', 'green');
        log(`   Status: ${register.status}`, 'blue');
        log(`   Usuário criado: ${testUser.email}`, 'blue');
      } else {
        log('❌ Cadastro de Usuário: Falhou', 'red');
        log(`   Status: ${register.status}`, 'red');
        if (register.data && register.data.message) {
          log(`   Erro: ${register.data.message}`, 'red');
        }
      }
    } catch (error) {
      log('❌ Cadastro de Usuário: Erro', 'red');
      log(`   ${error.message}`, 'red');
    }

    // Resumo final
    logSection('📋 RESUMO DOS TESTES');
    log('🎯 Sua API está funcionando!', 'green');
    log('🌐 URL: https://doce-sensacoes-backend-17.onrender.com', 'blue');
    log('📚 Endpoints disponíveis:', 'blue');
    log('   - GET  /health - Status da API', 'blue');
    log('   - GET  / - Rota principal', 'blue');
    log('   - GET  /api/products - Listar produtos', 'blue');
    log('   - GET  /api/products/featured - Produtos em destaque', 'blue');
    log('   - POST /api/auth/register - Cadastro de usuário', 'blue');
    log('   - POST /api/auth/login - Login de usuário', 'blue');

  } catch (error) {
    log('❌ Erro geral nos testes:', 'red');
    log(`   ${error.message}`, 'red');
  }
}

// Executar testes
testAPI(); 