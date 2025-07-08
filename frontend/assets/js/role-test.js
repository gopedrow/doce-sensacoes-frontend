// ========================================
// SCRIPT DE TESTE - SISTEMA DE ROLES
// ========================================

/**
 * Testa o sistema de roles e exibe resultados no console
 */
function testRoleSystem() {
  console.log('🧪 Iniciando testes do sistema de roles...\n');
  
  // Teste 1: Verificar se o RoleManager está disponível
  console.log('📋 Teste 1: Verificar disponibilidade do RoleManager');
  if (window.RoleManager) {
    console.log('✅ RoleManager está disponível');
  } else {
    console.log('❌ RoleManager não está disponível');
    return;
  }
  
  // Teste 2: Verificar usuário atual
  console.log('\n📋 Teste 2: Verificar usuário atual');
  const currentUser = window.RoleManager.getCurrentUser();
  if (currentUser) {
    console.log('✅ Usuário encontrado:', currentUser.name);
    console.log('📧 Email:', currentUser.email);
    console.log('👤 Tipo:', currentUser.user_type);
  } else {
    console.log('❌ Nenhum usuário autenticado');
    return;
  }
  
  // Teste 3: Verificar se é administrador
  console.log('\n📋 Teste 3: Verificar se é administrador');
  const isAdmin = window.RoleManager.isAdmin();
  console.log(isAdmin ? '✅ Usuário é administrador' : '❌ Usuário não é administrador');
  
  // Teste 4: Verificar se é cliente
  console.log('\n📋 Teste 4: Verificar se é cliente');
  const isClient = window.RoleManager.isClient();
  console.log(isClient ? '✅ Usuário é cliente' : '❌ Usuário não é cliente');
  
  // Teste 5: Verificar permissões específicas
  console.log('\n📋 Teste 5: Verificar permissões específicas');
  const permissions = [
    'manage_products',
    'manage_promotions',
    'view_dashboard',
    'view_products',
    'place_orders'
  ];
  
  permissions.forEach(permission => {
    const hasPermission = window.RoleManager.hasPermission(permission);
    console.log(`${hasPermission ? '✅' : '❌'} ${permission}: ${hasPermission}`);
  });
  
  // Teste 6: Verificar elementos administrativos no DOM
  console.log('\n📋 Teste 6: Verificar elementos administrativos no DOM');
  const adminElements = [
    '.admin-menu-item',
    '.admin-navbar-item',
    '.admin-badge'
  ];
  
  adminElements.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    console.log(`${elements.length > 0 ? '✅' : '❌'} ${selector}: ${elements.length} elemento(s) encontrado(s)`);
  });
  
  // Teste 7: Verificar seção administrativa no menu
  console.log('\n📋 Teste 7: Verificar seção administrativa no menu');
  const adminSection = document.querySelector('.admin-menu-section');
  if (adminSection) {
    console.log('✅ Seção administrativa encontrada no menu');
    const adminItems = adminSection.querySelectorAll('.sidebar-item');
    console.log(`📊 ${adminItems.length} item(s) administrativo(s) no menu`);
  } else {
    console.log('❌ Seção administrativa não encontrada no menu');
  }
  
  // Teste 8: Verificar CSS administrativo
  console.log('\n📋 Teste 8: Verificar CSS administrativo');
  const adminStyles = document.querySelector('link[href*="admin-styles.css"]');
  if (adminStyles) {
    console.log('✅ CSS administrativo carregado');
  } else {
    console.log('❌ CSS administrativo não carregado');
  }
  
  // Resumo dos testes
  console.log('\n📊 RESUMO DOS TESTES');
  console.log('====================');
  console.log(`👤 Tipo de usuário: ${currentUser?.user_type || 'N/A'}`);
  console.log(`👑 É administrador: ${isAdmin ? 'Sim' : 'Não'}`);
  console.log(`👤 É cliente: ${isClient ? 'Sim' : 'Não'}`);
  console.log(`🔐 Permissões ativas: ${permissions.filter(p => window.RoleManager.hasPermission(p)).length}/${permissions.length}`);
  
  if (isAdmin) {
    console.log('\n🎉 SISTEMA FUNCIONANDO CORRETAMENTE PARA ADMINISTRADOR!');
    console.log('💡 Você deve ver os itens administrativos no menu lateral');
  } else {
    console.log('\n✅ SISTEMA FUNCIONANDO CORRETAMENTE PARA CLIENTE!');
    console.log('💡 Você não deve ver os itens administrativos no menu');
  }
}

/**
 * Simula um usuário administrador para testes
 */
function simulateAdminUser() {
  console.log('🔧 Simulando usuário administrador...');
  
  const adminUser = {
    id: 'admin-test-123',
    name: 'Administrador Teste',
    email: 'admin@test.com',
    user_type: 'admin',
    phone: '(11) 99999-9999',
    loyalty_points: '0',
    total_orders: '0',
    avatar_url: '',
    is_active: 'TRUE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const sessionData = {
    user: adminUser,
    token: 'test-token-admin',
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
  };
  
  localStorage.setItem('doce_sensacoes_user', JSON.stringify(sessionData));
  localStorage.setItem('auth_token', 'test-token-admin');
  
  console.log('✅ Usuário administrador simulado');
  console.log('🔄 Recarregue a página para ver as mudanças');
}

/**
 * Simula um usuário cliente para testes
 */
function simulateClientUser() {
  console.log('🔧 Simulando usuário cliente...');
  
  const clientUser = {
    id: 'client-test-123',
    name: 'Cliente Teste',
    email: 'cliente@test.com',
    user_type: 'client',
    phone: '(11) 88888-8888',
    loyalty_points: '50',
    total_orders: '5',
    avatar_url: '',
    is_active: 'TRUE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const sessionData = {
    user: clientUser,
    token: 'test-token-client',
    expires: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
  };
  
  localStorage.setItem('doce_sensacoes_user', JSON.stringify(sessionData));
  localStorage.setItem('auth_token', 'test-token-client');
  
  console.log('✅ Usuário cliente simulado');
  console.log('🔄 Recarregue a página para ver as mudanças');
}

/**
 * Limpa dados de teste
 */
function clearTestData() {
  console.log('🧹 Limpando dados de teste...');
  localStorage.removeItem('doce_sensacoes_user');
  localStorage.removeItem('auth_token');
  console.log('✅ Dados de teste removidos');
  console.log('🔄 Recarregue a página para ver as mudanças');
}

/**
 * Exibe informações de debug
 */
function showDebugInfo() {
  console.log('🔍 INFORMAÇÕES DE DEBUG');
  console.log('========================');
  
  // Informações do localStorage
  console.log('\n📦 LocalStorage:');
  const sessionData = localStorage.getItem('doce_sensacoes_user');
  const token = localStorage.getItem('auth_token');
  console.log('Sessão:', sessionData ? 'Presente' : 'Ausente');
  console.log('Token:', token ? 'Presente' : 'Ausente');
  
  // Informações do DOM
  console.log('\n🌐 DOM:');
  console.log('RoleManager disponível:', !!window.RoleManager);
  console.log('Elementos admin no menu:', document.querySelectorAll('.admin-menu-item').length);
  console.log('CSS admin carregado:', !!document.querySelector('link[href*="admin-styles.css"]'));
  
  // Informações do usuário
  if (window.RoleManager) {
    const user = window.RoleManager.getCurrentUser();
    console.log('\n👤 Usuário:');
    console.log('Nome:', user?.name || 'N/A');
    console.log('Email:', user?.email || 'N/A');
    console.log('Tipo:', user?.user_type || 'N/A');
    console.log('É admin:', window.RoleManager.isAdmin());
    console.log('É cliente:', window.RoleManager.isClient());
  }
}

// Funções disponíveis globalmente para testes
window.RoleTest = {
  testRoleSystem,
  simulateAdminUser,
  simulateClientUser,
  clearTestData,
  showDebugInfo
};

// Executa teste automático se estiver em modo de desenvolvimento
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🚀 Modo de desenvolvimento detectado');
  console.log('💡 Use window.RoleTest.testRoleSystem() para testar o sistema');
  console.log('💡 Use window.RoleTest.simulateAdminUser() para simular admin');
  console.log('💡 Use window.RoleTest.simulateClientUser() para simular cliente');
  console.log('💡 Use window.RoleTest.showDebugInfo() para informações de debug');
} 