#!/usr/bin/env node

const { findByField, readSheet, writeSheet } = require('./src/config/googleSheets');

/**
 * Atualiza um usuário existente para administrador
 */
async function updateUserToAdmin(email) {
  try {
    console.log(`🍰 Atualizando usuário ${email} para administrador...\n`);
    
    // Buscar usuário pelo email
    const users = await findByField('users', 'email', email);
    
    if (users.length === 0) {
      console.log(`❌ Usuário com email ${email} não encontrado.`);
      return;
    }
    
    const user = users[0];
    
    if (user.user_type === 'admin') {
      console.log(`✅ Usuário ${email} já é administrador.`);
      return;
    }
    
    // Ler todos os dados da planilha para encontrar a linha correta
    const allData = await readSheet('users');
    
    // Encontrar o índice da linha do usuário
    const userIndex = allData.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) {
      console.log(`❌ Não foi possível encontrar a linha do usuário na planilha.`);
      return;
    }
    
    // Atualizar tipo de usuário para admin
    user.user_type = 'admin';
    user.is_active = 'TRUE';
    user.updated_at = new Date().toISOString();
    
    // Atualizar o usuário na lista
    allData[userIndex] = user;
    
    // Reescrever toda a planilha com o usuário atualizado
    await writeSheet('users', allData);
    
    console.log('✅ Usuário atualizado para administrador com sucesso!');
    console.log('\n📋 Informações do usuário:');
    console.log(`👤 Nome: ${user.name}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`📱 Telefone: ${user.phone || 'Não informado'}`);
    console.log(`👑 Tipo: ${user.user_type}`);
    console.log(`✅ Status: ${user.is_active === 'TRUE' ? 'Ativo' : 'Inativo'}`);
    
  } catch (error) {
    console.error('❌ Erro ao atualizar usuário:', error);
    process.exit(1);
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  const email = process.argv[2];
  
  if (!email) {
    console.log('🍰 Script para Atualizar Usuário para Administrador\n');
    console.log('📋 Uso: node update-user-to-admin.js <email>');
    console.log('\n💡 Exemplo: node update-user-to-admin.js ligia.adimin@docesensacoes.com');
    process.exit(1);
  }
  
  updateUserToAdmin(email).catch(console.error);
}

module.exports = {
  updateUserToAdmin
}; 