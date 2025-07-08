// ========================================
// SISTEMA DE GERENCIAMENTO DE ROLES - DOCE SENSACOES
// ========================================

// Configurações do sistema de roles
const ROLE_CONFIG = {
  // Tipos de usuário
  USER_TYPES: {
    ADMIN: 'admin',
    CLIENT: 'client'
  },
  
  // Permissões por tipo de usuário
  PERMISSIONS: {
    admin: [
      'manage_products',
      'manage_promotions', 
      'view_dashboard',
      'manage_orders',
      'view_reports',
      'manage_users'
    ],
    client: [
      'view_products',
      'place_orders',
      'view_profile',
      'view_orders'
    ]
  },
  
  // Mensagens
  MESSAGES: {
    ACCESS_DENIED: 'Acesso negado. Você não tem permissão para acessar este recurso.',
    ADMIN_REQUIRED: 'Esta funcionalidade é exclusiva para administradores.',
    SESSION_EXPIRED: 'Sessão expirada. Faça login novamente.'
  }
};

// ========================================
// FUNÇÕES DE VERIFICAÇÃO DE PERMISSÕES
// ========================================

/**
 * Verifica se o usuário atual tem uma permissão específica
 */
function hasPermission(permission) {
  const user = getCurrentUser();
  if (!user || !user.user_type) {
    return false;
  }
  
  const userPermissions = ROLE_CONFIG.PERMISSIONS[user.user_type] || [];
  return userPermissions.includes(permission);
}

/**
 * Verifica se o usuário atual é administrador
 */
function isAdmin() {
  const user = getCurrentUser();
  return user && user.user_type === ROLE_CONFIG.USER_TYPES.ADMIN;
}

/**
 * Verifica se o usuário atual é cliente
 */
function isClient() {
  const user = getCurrentUser();
  return user && user.user_type === ROLE_CONFIG.USER_TYPES.CLIENT;
}

/**
 * Obtém o usuário atual da sessão
 */
function getCurrentUser() {
  try {
    const sessionData = localStorage.getItem('doce_sensacoes_user');
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    return session.user || null;
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
}

// ========================================
// FUNÇÕES DE RENDERIZAÇÃO CONDICIONAL
// ========================================

/**
 * Renderiza elementos condicionalmente baseado no tipo de usuário
 */
function renderConditionalElements() {
  const user = getCurrentUser();
  
  if (!user) {
    console.warn('Usuário não autenticado');
    return;
  }
  
  // Renderiza elementos administrativos se for admin
  if (isAdmin()) {
    renderAdminElements();
  }
  
  // Renderiza elementos de cliente
  renderClientElements();
}

/**
 * Renderiza elementos exclusivos para administradores
 */
function renderAdminElements() {
  // Adiciona itens administrativos ao menu desktop
  const desktopMenu = document.querySelector('#sidebar_nav ul');
  if (desktopMenu && !document.querySelector('.admin-menu-item')) {
    const adminItems = createAdminMenuItems();
    desktopMenu.appendChild(adminItems);
  }
  
  // Adiciona itens administrativos ao menu mobile
  const mobileMenu = document.querySelector('.navbar-menu');
  if (mobileMenu && !document.querySelector('.admin-navbar-item')) {
    const adminNavItems = createAdminNavbarItems();
    mobileMenu.appendChild(adminNavItems);
  }
  
  // Adiciona indicador visual de admin
  addAdminIndicator();
}

/**
 * Renderiza elementos para clientes
 */
function renderClientElements() {
  // Elementos específicos para clientes podem ser adicionados aqui
  console.log('Renderizando elementos para cliente');
}

/**
 * Cria itens de menu administrativos para desktop
 */
function createAdminMenuItems() {
  const adminContainer = document.createElement('div');
  adminContainer.className = 'admin-menu-section';
  adminContainer.style.cssText = `
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(0,0,0,0.1);
  `;
  
  // Título da seção administrativa
  const adminTitle = document.createElement('div');
  adminTitle.style.cssText = `
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-primary-6);
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  `;
  adminTitle.textContent = 'Administração';
  adminContainer.appendChild(adminTitle);
  
  // Lista de itens administrativos
  const adminItems = [
    {
      section: 'cadastro-produtos',
      icon: 'fa-solid fa-box',
      text: 'Cadastro de Produtos',
      permission: 'manage_products'
    },
    {
      section: 'promocoes',
      icon: 'fa-solid fa-tags',
      text: 'Promoções',
      permission: 'manage_promotions'
    },
    {
      section: 'dashboard-admin',
      icon: 'fa-solid fa-chart-line',
      text: 'Dashboard Admin',
      permission: 'view_dashboard'
    }
  ];
  
  adminItems.forEach(item => {
    if (hasPermission(item.permission)) {
      const li = document.createElement('li');
      li.className = 'sidebar-item admin-menu-item';
      li.setAttribute('data-section', item.section);
      
      li.innerHTML = `
        <a href="#">
          <i class="${item.icon}"></i>
          <span>${item.text}</span>
        </a>
      `;
      
      // Adiciona evento de clique
      li.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(item.section);
      });
      
      adminContainer.appendChild(li);
    }
  });
  
  return adminContainer;
}

/**
 * Cria itens de menu administrativos para mobile
 */
function createAdminNavbarItems() {
  const adminItems = [
    {
      section: 'cadastro-produtos',
      icon: 'fa-solid fa-box',
      title: 'Cadastro de Produtos',
      permission: 'manage_products'
    },
    {
      section: 'promocoes',
      icon: 'fa-solid fa-tags',
      title: 'Promoções',
      permission: 'manage_promotions'
    },
    {
      section: 'dashboard-admin',
      icon: 'fa-solid fa-chart-line',
      title: 'Dashboard Admin',
      permission: 'view_dashboard'
    }
  ];
  
  adminItems.forEach(item => {
    if (hasPermission(item.permission)) {
      const li = document.createElement('li');
      li.className = 'navbar-item admin-navbar-item';
      li.setAttribute('data-section', item.section);
      
      li.innerHTML = `
        <a href="#" title="${item.title}">
          <i class="${item.icon}"></i>
        </a>
      `;
      
      // Adiciona evento de clique
      li.addEventListener('click', function(e) {
        e.preventDefault();
        showSection(item.section);
      });
    }
  });
}

/**
 * Adiciona indicador visual de administrador
 */
function addAdminIndicator() {
  const userInfo = document.querySelector('#user_infos');
  if (userInfo) {
    const adminBadge = document.createElement('div');
    adminBadge.className = 'admin-badge';
    adminBadge.style.cssText = `
      background: var(--color-primary-6);
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    `;
    adminBadge.textContent = 'Admin';
    userInfo.appendChild(adminBadge);
  }
}

// ========================================
// FUNÇÕES DE CONTEÚDO ADMINISTRATIVO
// ========================================

/**
 * Renderiza conteúdo administrativo baseado na seção
 */
function renderAdminContent(section) {
  switch (section) {
    case 'cadastro-produtos':
      return renderProductManagement();
    case 'promocoes':
      return renderPromotionManagement();
    case 'dashboard-admin':
      return renderAdminDashboard();
    default:
      return '<h1>Seção não encontrada</h1>';
  }
}

/**
 * Renderiza página de gerenciamento de produtos
 */
function renderProductManagement() {
  return `
    <div style="margin-top: 80px;"></div>
    <h1>Gerenciamento de Produtos</h1>
    
    <!-- Botão para adicionar novo produto -->
    <div class="card" style="margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3>Produtos do Catálogo</h3>
        <button id="add-product-btn" style="background: var(--color-primary-6); color: white; border: none; border-radius: 8px; padding: 12px 20px; font-weight: 600; cursor: pointer;">
          <i class="fa-solid fa-plus"></i> Adicionar Produto
        </button>
      </div>
    </div>
    
    <!-- Lista de produtos -->
    <div class="card">
      <div id="products-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
        <!-- Produtos serão carregados dinamicamente -->
        <div style="text-align: center; padding: 40px; color: #666;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 16px;"></i>
          <p>Carregando produtos...</p>
        </div>
      </div>
    </div>
    
    <!-- Modal para adicionar/editar produto -->
    <div id="product-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000;">
      <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 16px; padding: 32px; max-width: 500px; width: 90%; max-height: 90vh; overflow-y: auto;">
        <h3 id="modal-title">Adicionar Produto</h3>
        <form id="product-form">
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Nome do Produto</label>
            <input type="text" id="product-name" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Descrição</label>
            <textarea id="product-description" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; min-height: 100px; resize: vertical;"></textarea>
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Preço (R$)</label>
            <input type="number" id="product-price" step="0.01" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
          </div>
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">URL da Imagem</label>
            <input type="url" id="product-image" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
          </div>
          <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button type="button" id="cancel-product" style="padding: 12px 24px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer;">Cancelar</button>
            <button type="submit" style="padding: 12px 24px; background: var(--color-primary-6); color: white; border: none; border-radius: 8px; cursor: pointer;">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

/**
 * Renderiza página de gerenciamento de promoções
 */
function renderPromotionManagement() {
  return `
    <div style="margin-top: 80px;"></div>
    <h1>Gerenciamento de Promoções</h1>
    
    <!-- Estatísticas de engajamento -->
    <div class="card" style="margin-bottom: 24px;">
      <h3>Estatísticas de Engajamento</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 16px;">
        <div style="text-align: center; padding: 20px; background: var(--color-primary-1); border-radius: 12px;">
          <div style="font-size: 2rem; font-weight: 600; color: var(--color-primary-6);">15</div>
          <div style="font-size: 0.9rem; color: #666;">Cupons Ativos</div>
        </div>
        <div style="text-align: center; padding: 20px; background: var(--color-primary-1); border-radius: 12px;">
          <div style="font-size: 2rem; font-weight: 600; color: var(--color-primary-6);">1.2k</div>
          <div style="font-size: 0.9rem; color: #666;">Usos de Cupons</div>
        </div>
        <div style="text-align: center; padding: 20px; background: var(--color-primary-1); border-radius: 12px;">
          <div style="font-size: 2rem; font-weight: 600; color: var(--color-primary-6);">R$ 8.5k</div>
          <div style="font-size: 0.9rem; color: #666;">Descontos Aplicados</div>
        </div>
      </div>
    </div>
    
    <!-- Criar nova promoção -->
    <div class="card" style="margin-bottom: 24px;">
      <h3>Criar Nova Promoção</h3>
      <form id="promotion-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 16px;">
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 600;">Código do Cupom</label>
          <input type="text" id="coupon-code" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 600;">Percentual de Desconto (%)</label>
          <input type="number" id="discount-percent" min="1" max="100" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 600;">Data de Início</label>
          <input type="date" id="start-date" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 600;">Data de Fim</label>
          <input type="date" id="end-date" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px;">
        </div>
        <div style="grid-column: 1 / -1;">
          <label style="display: block; margin-bottom: 8px; font-weight: 600;">Descrição da Promoção</label>
          <textarea id="promotion-description" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; min-height: 80px; resize: vertical;"></textarea>
        </div>
        <div style="grid-column: 1 / -1;">
          <button type="submit" style="background: var(--color-primary-6); color: white; border: none; border-radius: 8px; padding: 12px 24px; font-weight: 600; cursor: pointer;">
            <i class="fa-solid fa-plus"></i> Criar Promoção
          </button>
        </div>
      </form>
    </div>
    
    <!-- Lista de promoções ativas -->
    <div class="card">
      <h3>Promoções Ativas</h3>
      <div id="promotions-list" style="margin-top: 16px;">
        <div style="text-align: center; padding: 40px; color: #666;">
          <i class="fa-solid fa-tags" style="font-size: 2rem; margin-bottom: 16px;"></i>
          <p>Nenhuma promoção ativa no momento</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza dashboard administrativo
 */
function renderAdminDashboard() {
  return `
    <div style="margin-top: 80px;"></div>
    <h1>Dashboard Administrativo</h1>
    
    <!-- Cards de resumo -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 2.5rem; font-weight: 600; color: var(--color-primary-6); margin-bottom: 8px;">R$ 12.5k</div>
        <div style="font-size: 0.9rem; color: #666;">Vendas do Mês</div>
      </div>
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 2.5rem; font-weight: 600; color: var(--color-primary-6); margin-bottom: 8px;">156</div>
        <div style="font-size: 0.9rem; color: #666;">Pedidos Realizados</div>
      </div>
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 2.5rem; font-weight: 600; color: var(--color-primary-6); margin-bottom: 8px;">89</div>
        <div style="font-size: 0.9rem; color: #666;">Clientes Ativos</div>
      </div>
      <div class="card" style="text-align: center; padding: 24px;">
        <div style="font-size: 2.5rem; font-weight: 600; color: var(--color-primary-6); margin-bottom: 8px;">4.8</div>
        <div style="font-size: 0.9rem; color: #666;">Avaliação Média</div>
      </div>
    </div>
    
    <!-- Produtos mais vendidos -->
    <div class="card" style="margin-bottom: 24px;">
      <h3>Produtos Mais Vendidos</h3>
      <div style="margin-top: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="assets/images/dish.png" alt="Bolo de Chocolate" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
              <div style="font-weight: 600;">Bolo de Chocolate</div>
              <div style="font-size: 0.9rem; color: #666;">45 vendas</div>
            </div>
          </div>
          <div style="font-weight: 600; color: var(--color-primary-6);">R$ 2.025,00</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #eee;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="assets/images/dish2.png" alt="Torta de Limão" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
              <div style="font-weight: 600;">Torta de Limão</div>
              <div style="font-size: 0.9rem; color: #666;">32 vendas</div>
            </div>
          </div>
          <div style="font-weight: 600; color: var(--color-primary-6);">R$ 1.216,00</div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="assets/images/dish3.png" alt="Brigadeiro Gourmet" style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;">
            <div>
              <div style="font-weight: 600;">Brigadeiro Gourmet</div>
              <div style="font-size: 0.9rem; color: #666;">28 vendas</div>
            </div>
          </div>
          <div style="font-weight: 600; color: var(--color-primary-6);">R$ 504,00</div>
        </div>
      </div>
    </div>
    
    <!-- Feedbacks recentes -->
    <div class="card">
      <h3>Feedbacks Recentes</h3>
      <div style="margin-top: 16px;">
        <div style="padding: 16px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div style="font-weight: 600;">Maria Silva</div>
            <div style="color: gold;">★★★★★</div>
          </div>
          <div style="color: #666; font-size: 0.9rem; line-height: 1.4;">
            "Excelente qualidade! O bolo estava delicioso e a entrega foi pontual. Recomendo muito!"
          </div>
        </div>
        <div style="padding: 16px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
            <div style="font-weight: 600;">João Santos</div>
            <div style="color: gold;">★★★★☆</div>
          </div>
          <div style="color: #666; font-size: 0.9rem; line-height: 1.4;">
            "Muito bom! Só demorou um pouco mais na entrega, mas o produto compensou."
          </div>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// FUNÇÕES DE SEGURANÇA
// ========================================

/**
 * Verifica se o usuário tem acesso à seção solicitada
 */
function checkSectionAccess(section) {
  const user = getCurrentUser();
  
  if (!user) {
    showMessage(ROLE_CONFIG.MESSAGES.SESSION_EXPIRED, 'error');
    return false;
  }
  
  // Seções administrativas
  const adminSections = ['cadastro-produtos', 'promocoes', 'dashboard-admin'];
  
  if (adminSections.includes(section) && !isAdmin()) {
    showMessage(ROLE_CONFIG.MESSAGES.ADMIN_REQUIRED, 'error');
    return false;
  }
  
  return true;
}

/**
 * Mostra uma mensagem de feedback
 */
function showMessage(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
    font-size: 14px;
    max-width: 300px;
    animation: slideInRight 0.3s ease;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// ========================================
// INICIALIZAÇÃO
// ========================================

/**
 * Inicializa o sistema de roles
 */
function initRoleManager() {
  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRoleManager);
    return;
  }
  
  // Verifica se o usuário está autenticado
  const user = getCurrentUser();
  if (!user) {
    console.warn('Usuário não autenticado - sistema de roles não inicializado');
    return;
  }
  
  // Renderiza elementos condicionalmente
  renderConditionalElements();
  
  console.log(`Sistema de roles inicializado para usuário: ${user.user_type}`);
}

// Inicializa o sistema quando o script é carregado
initRoleManager();

// Exporta funções para uso global
window.RoleManager = {
  hasPermission,
  isAdmin,
  isClient,
  getCurrentUser,
  checkSectionAccess,
  renderAdminContent,
  initRoleManager
}; 