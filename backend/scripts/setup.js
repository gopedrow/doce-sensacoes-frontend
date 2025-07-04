#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🍰 Configurando Backend Doce Sensações...\n');

// Verificar se Node.js está instalado
try {
  const nodeVersion = process.version;
  console.log(`✅ Node.js ${nodeVersion} detectado`);
} catch (error) {
  console.error('❌ Node.js não encontrado. Instale Node.js 16+ primeiro.');
  process.exit(1);
}

// Verificar se npm está instalado
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm ${npmVersion} detectado`);
} catch (error) {
  console.error('❌ npm não encontrado.');
  process.exit(1);
}

// Instalar dependências
console.log('\n📦 Instalando dependências...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependências instaladas com sucesso!');
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message);
  process.exit(1);
}

// Criar arquivo .env se não existir
const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('\n🔧 Criando arquivo .env...');
  try {
    const envExample = fs.readFileSync(envExamplePath, 'utf8');
    fs.writeFileSync(envPath, envExample);
    console.log('✅ Arquivo .env criado!');
    console.log('💡 Edite o arquivo .env com suas configurações de banco de dados');
  } catch (error) {
    console.error('❌ Erro ao criar .env:', error.message);
  }
} else {
  console.log('✅ Arquivo .env já existe');
}

// Criar pasta uploads se não existir
const uploadsPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsPath)) {
  console.log('\n📁 Criando pasta uploads...');
  try {
    fs.mkdirSync(uploadsPath, { recursive: true });
    console.log('✅ Pasta uploads criada!');
  } catch (error) {
    console.error('❌ Erro ao criar pasta uploads:', error.message);
  }
} else {
  console.log('✅ Pasta uploads já existe');
}

// Instruções finais
console.log('\n🎉 Configuração concluída!');
console.log('\n📋 Próximos passos:');
console.log('1. Configure o banco de dados MySQL');
console.log('2. Execute o schema: mysql -u root -p doce_sensacoes < database/schema.sql');
console.log('3. Edite o arquivo .env com suas configurações');
console.log('4. Inicie o servidor: npm run dev');
console.log('\n🌐 O servidor estará disponível em: http://localhost:3000');
console.log('📚 Documentação: http://localhost:3000/health');

console.log('\n🍰 Doce Sensações Backend está pronto!'); 