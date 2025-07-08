// ========================================
// SISTEMA DE PROTEÇÃO DE ROTAS - DOCE SENSACOES
// ========================================

// Configuração da API
const API_BASE_URL = 'https://doce-sensacoes-api.onrender.com/api';

// Configurações do sistema de autenticação
const AUTH_CONFIG = {
  SESSION_KEY: 'doce_sensacoes_user',
  TOKEN_KEY: 'auth_token',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas em ms
  
  // URLs de redirecionamento
  LOGIN_URL: 'login.html',
  PROFILE_URL: 'perfil.html',
  
  // Mensagens
  MESSAGES: {
    SESSION_EXPIRED: 'Sessão expirada. Faça login novamente.',
    NOT_AUTHENTICATED: 'Você precisa estar logado para acessar esta página.',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    SERVER_ERROR: 'Erro no servidor. Tente novamente.'
  }
};

// ========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ========================================

/**
 * Verifica se existe uma sessão válida
 */
function checkUserSession() {
  const sessionData = localStorage.getItem(AUTH_CONFIG.SESSION_KEY);
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  
  if (!sessionData || !token) {
    return null;
  }
  
  try {
    const session = JSON.parse(sessionData);
    
    // Verifica se a sessão não expirou
    if (Date.now() > session.expires) {
      localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      return null;
    }
    
    return session;
  } catch (error) {
    localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    return null;
  }
}

/**
 * Verifica se o token é válido no servidor
 */
async function validateTokenWithServer(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      return { valid: true, user: data.user };
    } else {
      return { valid: false };
    }
  } catch (error) {
    console.error('Erro ao validar token:', error);
    return { valid: false };
  }
}

/**
 * Remove a sessão do usuário (logout)
 */
function logoutUser() {
  localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  return true;
}

/**
 * Redireciona para a página de login
 */
function redirectToLogin() {
  window.location.href = AUTH_CONFIG.LOGIN_URL;
}

/**
 * Mostra uma mensagem de feedback
 */
function showMessage(message, type = 'info') {
  // Remove mensagens anteriores
  const existingMessage = document.querySelector('.message-feedback');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Cria a nova mensagem
  const messageDiv = document.createElement('div');
  messageDiv.className = `message-feedback message-${type}`;
  messageDiv.innerHTML = `
    <div class="message-content">
      <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Adiciona estilos inline
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
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
  
  // Adiciona animação CSS
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  // Adiciona ao DOM
  document.body.appendChild(messageDiv);
  
  // Remove após 3 segundos
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.remove();
    }
  }, 3000);
}

// ========================================
// FUNÇÕES DE PROTEÇÃO DE ROTAS
// ========================================

/**
 * Verifica se o usuário está autenticado e redireciona se necessário
 */
async function requireAuth() {
  const session = checkUserSession();
  
  if (!session) {
    showMessage(AUTH_CONFIG.MESSAGES.NOT_AUTHENTICATED, 'error');
    setTimeout(() => {
      redirectToLogin();
    }, 1500);
    return false;
  }
  
  // Valida o token no servidor
  const tokenValidation = await validateTokenWithServer(session.token);
  
  if (!tokenValidation.valid) {
    // Token inválido, remove a sessão
    logoutUser();
    showMessage(AUTH_CONFIG.MESSAGES.SESSION_EXPIRED, 'error');
    setTimeout(() => {
      redirectToLogin();
    }, 1500);
    return false;
  }
  
  // Atualiza os dados do usuário com informações do servidor
  if (tokenValidation.user) {
    session.user = {
      ...session.user,
      ...tokenValidation.user
    };
    localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
  }
  
  return session;
}

/**
 * Verifica se o usuário está autenticado (sem redirecionamento)
 */
function isAuthenticated() {
  return checkUserSession() !== null;
}

/**
 * Obtém os dados do usuário logado
 */
function getCurrentUser() {
  const session = checkUserSession();
  return session ? session.user : null;
}

/**
 * Atualiza a interface com os dados do usuário
 */
function updateUserInterface() {
  const user = getCurrentUser();
  
  if (!user) {
    return;
  }
  
  // Atualiza elementos que mostram o nome do usuário
  const userNameElements = document.querySelectorAll('.user-name, .user-email');
  userNameElements.forEach(element => {
    if (element.classList.contains('user-name')) {
      element.textContent = user.name;
    } else if (element.classList.contains('user-email')) {
      element.textContent = user.email;
    }
  });
  
  // Atualiza elementos de logout
  const logoutButtons = document.querySelectorAll('.logout-btn, .btn-logout');
  logoutButtons.forEach(button => {
    button.addEventListener('click', handleLogout);
  });
  
  // Atualiza informações do perfil se estiver na página de perfil
  if (window.location.pathname.includes('perfil.html')) {
    updateProfileInfo(user);
  }
}

/**
 * Atualiza informações específicas do perfil
 */
function updateProfileInfo(user) {
  // Atualiza nome do usuário
  const nameElements = document.querySelectorAll('#user_name, .profile-name');
  nameElements.forEach(element => {
    element.textContent = user.name;
  });
  
  // Atualiza email do usuário
  const emailElements = document.querySelectorAll('#user_email, .profile-email');
  emailElements.forEach(element => {
    element.textContent = user.email;
  });
  
  // Atualiza telefone do usuário
  const phoneElements = document.querySelectorAll('#user_phone, .profile-phone');
  phoneElements.forEach(element => {
    element.textContent = user.phone || 'Não informado';
  });
  
  // Atualiza pontos de fidelidade
  const pointsElements = document.querySelectorAll('.loyalty-points');
  pointsElements.forEach(element => {
    element.textContent = user.loyalty_points || 0;
  });
  
  // Atualiza total de pedidos
  const ordersElements = document.querySelectorAll('.total-orders');
  ordersElements.forEach(element => {
    element.textContent = user.total_orders || 0;
  });
  
  // Atualiza avatar se existir
  if (user.avatar_url) {
    const avatarElements = document.querySelectorAll('#user_avatar, .profile-avatar');
    avatarElements.forEach(element => {
      element.src = user.avatar_url;
    });
  }
}

/**
 * Manipula o logout
 */
async function handleLogout(event) {
  if (event) {
    event.preventDefault();
  }
  
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  
  // Tenta fazer logout no servidor
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Erro ao fazer logout no servidor:', error);
    }
  }
  
  // Remove dados locais
  logoutUser();
  showMessage(AUTH_CONFIG.MESSAGES.LOGOUT_SUCCESS, 'success');
  
  setTimeout(() => {
    redirectToLogin();
  }, 1500);
}

// ========================================
// FUNÇÕES DE INICIALIZAÇÃO
// ========================================

/**
 * Inicializa o sistema de proteção de rotas
 */
async function initAuthGuard() {
  try {
    // Verifica autenticação
    const session = await requireAuth();
    
    if (session) {
      // Atualiza a interface
      updateUserInterface();
      
      // Log de inicialização
      console.log('🔒 Sistema de Proteção de Rotas inicializado!');
      console.log('👤 Usuário logado:', session.user.name);
      console.log('🔗 Conectando com API:', API_BASE_URL);
    }
  } catch (error) {
    console.error('Erro ao inicializar proteção de rotas:', error);
    showMessage(AUTH_CONFIG.MESSAGES.SERVER_ERROR, 'error');
  }
}

/**
 * Inicializa o sistema de verificação de autenticação (sem redirecionamento)
 */
function initAuthCheck() {
  const session = checkUserSession();
  
  if (session) {
    updateUserInterface();
    console.log('🔒 Verificação de autenticação: Usuário logado');
    console.log('🔗 Conectando com API:', API_BASE_URL);
  } else {
    console.log('🔒 Verificação de autenticação: Usuário não logado');
  }
}

// ========================================
// EXPOSIÇÃO DE FUNÇÕES GLOBAIS
// ========================================

// Expõe funções para uso em outras páginas
window.AuthGuard = {
  requireAuth,
  isAuthenticated,
  getCurrentUser,
  logoutUser: handleLogout,
  showMessage,
  updateUserInterface,
  API_BASE_URL
};

// ========================================
// INICIALIZAÇÃO AUTOMÁTICA
// ========================================

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos em uma página protegida
    const isProtectedPage = window.location.pathname.includes('perfil.html') || 
                           window.location.pathname.includes('admin') ||
                           document.querySelector('[data-require-auth]');
    
    if (isProtectedPage) {
      initAuthGuard();
    } else {
      initAuthCheck();
    }
  });
} else {
  // Se o DOM já está carregado, inicializa imediatamente
  const isProtectedPage = window.location.pathname.includes('perfil.html') || 
                         window.location.pathname.includes('admin') ||
                         document.querySelector('[data-require-auth]');
  
  if (isProtectedPage) {
    initAuthGuard();
  } else {
    initAuthCheck();
  }
} 