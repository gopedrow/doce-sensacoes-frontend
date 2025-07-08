#!/usr/bin/env node

const bcrypt = require('bcryptjs');
const { appendRow, findByField, generateId } = require('../src/config/googleSheets');

// Configuração para criar usuário administrador
const ADMIN_CONFIG = {
  name: 'Administrador',
  email: 'admin@doce-sensacoes.com',
  password: 'admin123',
  phone: '(11) 99999-9999',
  user_type: 'admin'
};

/**
 * Cria um usuário administrador no sistema
 */
async function createAdminUser() {
  try {
    console.log('🍰 Criando usuário administrador...\n');
    
    // Verificar se já existe um admin com este email
    const existingUsers = await findByField('users', 'email', ADMIN_CONFIG.email);
    
    if (existingUsers.length > 0) {
      console.log('⚠️  Usuário administrador já existe!');
      console.log(`📧 Email: ${ADMIN_CONFIG.email}`);
      console.log(`🔑 Senha: ${ADMIN_CONFIG.password}`);
      return;
    }
    
    // Criptografar senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(ADMIN_CONFIG.password, saltRounds);
    
    // Gerar ID único
    const userId = generateId();
    
    // Preparar dados do usuário administrador
    const adminData = {
      id: userId,
      name: ADMIN_CONFIG.name,
      email: ADMIN_CONFIG.email,
      password_hash: hashedPassword,
      phone: ADMIN_CONFIG.phone,
      user_type: ADMIN_CONFIG.user_type,
      loyalty_points: '0',
      total_orders: '0',
      avatar_url: '',
      is_active: 'TRUE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Adicionar usuário à planilha
    await appendRow('users', adminData);
    
    console.log('✅ Usuário administrador criado com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log(`📧 Email: ${ADMIN_CONFIG.email}`);
    console.log(`🔑 Senha: ${ADMIN_CONFIG.password}`);
    console.log(`👤 Tipo: ${ADMIN_CONFIG.user_type}`);
    console.log('\n⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário administrador:', error);
    process.exit(1);
  }
}

/**
 * Lista todos os usuários administradores
 */
async function listAdminUsers() {
  try {
    console.log('👥 Listando usuários administradores...\n');
    
    // Buscar todos os usuários admin
    const allUsers = await findByField('users', 'user_type', 'admin');
    
    if (allUsers.length === 0) {
      console.log('❌ Nenhum usuário administrador encontrado.');
      return;
    }
    
    console.log(`✅ Encontrados ${allUsers.length} usuário(s) administrador(es):\n`);
    
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   📱 Telefone: ${user.phone || 'Não informado'}`);
      console.log(`   📅 Criado em: ${new Date(user.created_at).toLocaleDateString('pt-BR')}`);
      console.log(`   ✅ Status: ${user.is_active === 'TRUE' ? 'Ativo' : 'Inativo'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro ao listar usuários administradores:', error);
  }
}

/**
 * Função principal
 */
async function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'create':
      await createAdminUser();
      break;
    case 'list':
      await listAdminUsers();
      break;
    default:
      console.log('🍰 Script de Gerenciamento de Usuários Administradores\n');
      console.log('📋 Comandos disponíveis:');
      console.log('  node create-admin.js create  - Criar novo usuário administrador');
      console.log('  node create-admin.js list    - Listar usuários administradores');
      console.log('\n💡 Exemplo: node create-admin.js create');
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createAdminUser,
  listAdminUsers
}; 