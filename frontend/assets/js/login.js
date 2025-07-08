// ========================================
// SISTEMA DE LOGIN - DOCE SENSACOES
// ========================================

// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Configurações do sistema
const AUTH_CONFIG = {
  // Configurações de sessão
  SESSION_KEY: 'doce_sensacoes_user',
  TOKEN_KEY: 'auth_token',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas em ms
  
  // URLs de redirecionamento
  SUCCESS_REDIRECT: 'perfil.html',
  FAILURE_REDIRECT: 'index.html',
  
  // Mensagens
  MESSAGES: {
    SUCCESS: 'Login realizado com sucesso!',
    INVALID_CREDENTIALS: 'Email ou senha incorretos!',
    EMPTY_FIELDS: 'Por favor, preencha todos os campos!',
    INVALID_EMAIL: 'Por favor, insira um email válido!',
    SESSION_EXPIRED: 'Sessão expirada. Faça login novamente.',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso!',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    SERVER_ERROR: 'Erro no servidor. Tente novamente.'
  }
};

// ========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ========================================

/**
 * Valida se um email é válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida os campos do formulário
 */
function validateLoginForm(email, password) {
  // Verifica se os campos estão preenchidos
  if (!email || !password) {
    return { valid: false, message: AUTH_CONFIG.MESSAGES.EMPTY_FIELDS };
  }
  
  // Verifica se o email é válido
  if (!isValidEmail(email)) {
    return { valid: false, message: AUTH_CONFIG.MESSAGES.INVALID_EMAIL };
  }
  
  return { valid: true };
}

/**
 * Autentica o usuário via API
 */
async function authenticateUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || AUTH_CONFIG.MESSAGES.INVALID_CREDENTIALS 
      };
    }

    return { 
      success: true, 
      user: data.user, 
      token: data.token 
    };
  } catch (error) {
    console.error('Erro na autenticação:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { 
        success: false, 
        message: AUTH_CONFIG.MESSAGES.NETWORK_ERROR 
      };
    }
    
    return { 
      success: false, 
      message: AUTH_CONFIG.MESSAGES.SERVER_ERROR 
    };
  }
}

/**
 * Cria uma sessão de usuário
 */
function createUserSession(user, token) {
  const session = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.user_type || 'user',
      phone: user.phone || '',
      loyalty_points: user.loyalty_points || 0,
      total_orders: user.total_orders || 0,
      avatar_url: user.avatar_url || ''
    },
    token: token,
    timestamp: Date.now(),
    expires: Date.now() + AUTH_CONFIG.SESSION_TIMEOUT
  };
  
  // Armazena a sessão no localStorage
  localStorage.setItem(AUTH_CONFIG.SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
  
  return session;
}

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
 * Remove a sessão do usuário (logout)
 */
function logoutUser() {
  localStorage.removeItem(AUTH_CONFIG.SESSION_KEY);
  localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  return true;
}

/**
 * Redireciona o usuário baseado na autenticação
 */
function redirectUser(success = true) {
  const url = success ? AUTH_CONFIG.SUCCESS_REDIRECT : AUTH_CONFIG.FAILURE_REDIRECT;
  
  // Adiciona um pequeno delay para mostrar a mensagem
  setTimeout(() => {
    window.location.href = url;
  }, 1000);
}

// ========================================
// FUNÇÕES DE INTERFACE
// ========================================

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

/**
 * Mostra/esconde o indicador de carregamento
 */
function toggleLoading(show = true) {
  const button = document.querySelector('#loginForm button[type="submit"]');
  
  if (button) {
    if (show) {
      button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Entrando...';
      button.disabled = true;
    } else {
      button.innerHTML = 'Entrar';
      button.disabled = false;
    }
  }
}

// ========================================
// HANDLERS DE EVENTOS
// ========================================

/**
 * Manipula o envio do formulário de login
 */
async function handleLoginSubmit(event) {
  event.preventDefault();
  
  // Obtém os dados do formulário
  const formData = new FormData(event.target);
  const email = formData.get('email') || event.target.querySelector('input[type="email"]').value;
  const password = formData.get('password') || event.target.querySelector('input[type="password"]').value;
  
  // Valida o formulário
  const validation = validateLoginForm(email, password);
  if (!validation.valid) {
    showMessage(validation.message, 'error');
    return;
  }
  
  // Mostra loading
  toggleLoading(true);
  
  try {
    // Autentica o usuário via API
    const authResult = await authenticateUser(email, password);
    
    if (authResult.success) {
      // Cria a sessão
      createUserSession(authResult.user, authResult.token);
      
      // Mostra mensagem de sucesso
      showMessage(AUTH_CONFIG.MESSAGES.SUCCESS, 'success');
      
      // Redireciona
      redirectUser(true);
    } else {
      // Mostra mensagem de erro
      showMessage(authResult.message, 'error');
      
      // Remove loading
      toggleLoading(false);
    }
  } catch (error) {
    console.error('Erro no login:', error);
    showMessage(AUTH_CONFIG.MESSAGES.SERVER_ERROR, 'error');
    toggleLoading(false);
  }
}

/**
 * Manipula a transição para cadastro
 */
function handleCadastroTransition(e) {
  e.preventDefault();
  
  const leftElement = document.querySelector('.left');
  const rightElement = document.querySelector('.right');
  
  if (leftElement && rightElement) {
    leftElement.classList.add('expand');
    rightElement.classList.add('shrink');
    
    setTimeout(() => {
      window.location.href = 'cadastro.html';
    }, 700);
  }
}

/**
 * Manipula o link "Esqueceu sua senha?"
 */
function handleForgotPassword(e) {
  e.preventDefault();
  
  // Em produção, isso redirecionaria para uma página de recuperação
  showMessage('Funcionalidade em desenvolvimento. Entre em contato via WhatsApp!', 'info');
}

// ========================================
// AUTENTICAÇÃO SOCIAL
// ========================================

/**
 * Configurações de autenticação social
 */
const SOCIAL_CONFIG = {
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // Substitua pelo seu Client ID
  FACEBOOK_APP_ID: 'YOUR_FACEBOOK_APP_ID',   // Substitua pelo seu App ID
  WHATSAPP_NUMBER: '5562986483753'
};

/**
 * Inicializa o Google Sign-In
 */
function initGoogleSignIn() {
  // Carrega o Google Sign-In API
  if (typeof gapi !== 'undefined') {
    gapi.load('auth2', function() {
      gapi.auth2.init({
        client_id: SOCIAL_CONFIG.GOOGLE_CLIENT_ID
      }).then(function(auth2) {
        console.log('Google Sign-In inicializado');
      });
    });
  }
}

/**
 * Manipula login com Google
 */
async function handleGoogleLogin() {
  try {
    if (typeof gapi === 'undefined') {
      showMessage('Google Sign-In não disponível. Tente novamente.', 'error');
      return;
    }

    const auth2 = gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();
    const profile = googleUser.getBasicProfile();
    const idToken = googleUser.getAuthResponse().id_token;

    // Dados do usuário do Google
    const userData = {
      name: profile.getName(),
      email: profile.getEmail(),
      avatar_url: profile.getImageUrl(),
      google_id: profile.getId(),
      id_token: idToken
    };

    // Envia para o backend
    const result = await authenticateSocialUser('google', userData);
    
    if (result.success) {
      createUserSession(result.user, result.token);
      showMessage('Login com Google realizado com sucesso!', 'success');
      redirectUser(true);
    } else {
      showMessage(result.message, 'error');
    }

  } catch (error) {
    console.error('Erro no login Google:', error);
    showMessage('Erro ao fazer login com Google. Tente novamente.', 'error');
  }
}

/**
 * Manipula login com Facebook
 */
async function handleFacebookLogin() {
  try {
    if (typeof FB === 'undefined') {
      showMessage('Facebook SDK não disponível. Tente novamente.', 'error');
      return;
    }

    FB.login(function(response) {
      if (response.authResponse) {
        // Usuário autorizou o app
        FB.api('/me', { fields: 'name,email,picture' }, function(userData) {
          const socialData = {
            name: userData.name,
            email: userData.email,
            avatar_url: userData.picture?.data?.url,
            facebook_id: userData.id,
            access_token: response.authResponse.accessToken
          };

          authenticateSocialUser('facebook', socialData).then(result => {
            if (result.success) {
              createUserSession(result.user, result.token);
              showMessage('Login com Facebook realizado com sucesso!', 'success');
              redirectUser(true);
            } else {
              showMessage(result.message, 'error');
            }
          });
        });
      } else {
        showMessage('Login com Facebook cancelado.', 'info');
      }
    }, { scope: 'email,public_profile' });

  } catch (error) {
    console.error('Erro no login Facebook:', error);
    showMessage('Erro ao fazer login com Facebook. Tente novamente.', 'error');
  }
}

/**
 * Manipula login com WhatsApp
 */
function handleWhatsAppLogin() {
  const message = encodeURIComponent('Olá! Gostaria de fazer login na minha conta Doce Sensações. Pode me ajudar?');
  const whatsappUrl = `https://wa.me/${SOCIAL_CONFIG.WHATSAPP_NUMBER}?text=${message}`;
  
  // Abre WhatsApp em nova aba
  window.open(whatsappUrl, '_blank');
  
  showMessage('WhatsApp aberto! Entre em contato para fazer login.', 'info');
}

/**
 * Autentica usuário via rede social
 */
async function authenticateSocialUser(provider, userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/social/${provider}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || `Erro no login com ${provider}` 
      };
    }

    return { 
      success: true, 
      user: data.user, 
      token: data.token 
    };
  } catch (error) {
    console.error(`Erro na autenticação ${provider}:`, error);
    return { 
      success: false, 
      message: `Erro de conexão. Tente novamente.` 
    };
  }
}

// ========================================
// FUNÇÕES DE INICIALIZAÇÃO
// ========================================

/**
 * Verifica se o usuário já está logado
 */
function checkAlreadyLoggedIn() {
  const session = checkUserSession();
  
  if (session) {
    // Se já está logado, redireciona para o perfil
    window.location.href = AUTH_CONFIG.SUCCESS_REDIRECT;
    return true;
  }
  
  return false;
}

/**
 * Inicializa as animações do ScrollReveal
 */
function initScrollReveal() {
  if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal().reveal('.left', {
      origin: 'left',
      distance: '60px',
      duration: 1200,
      delay: 200,
      opacity: 0,
      easing: 'ease',
      reset: false
    });
    
    ScrollReveal().reveal('.right', {
      origin: 'right',
      distance: '60px',
      duration: 1200,
      delay: 400,
      opacity: 0,
      easing: 'ease',
      reset: false
    });
  }
}

/**
 * Inicializa todos os event listeners
 */
function initEventListeners() {
  const loginForm = document.getElementById('loginForm');
  const cadastroLink = document.getElementById('goToCadastro');
  const forgotLink = document.querySelector('.forgot');
  
  // Botões de login social
  const googleBtn = document.getElementById('googleLogin');
  const facebookBtn = document.getElementById('facebookLogin');
  const whatsappBtn = document.getElementById('whatsappLogin');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
  
  if (cadastroLink) {
    cadastroLink.addEventListener('click', handleCadastroTransition);
  }
  
  if (forgotLink) {
    forgotLink.addEventListener('click', handleForgotPassword);
  }
  
  // Event listeners para login social
  if (googleBtn) {
    googleBtn.addEventListener('click', handleGoogleLogin);
  }
  
  if (facebookBtn) {
    facebookBtn.addEventListener('click', handleFacebookLogin);
  }
  
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', handleWhatsAppLogin);
  }
}

/**
 * Função principal de inicialização
 */
function init() {
  // Verifica se já está logado
  if (checkAlreadyLoggedIn()) {
    return;
  }
  
  // Inicializa event listeners
  initEventListeners();
  
  // Inicializa animações
  if (typeof ScrollReveal !== 'undefined') {
    initScrollReveal();
  } else {
    setTimeout(initScrollReveal, 100);
  }
  
  // Inicializa SDKs sociais
  initSocialSDKs();
  
  // Log de inicialização
  console.log('🚀 Sistema de Login Doce Sensações inicializado!');
  console.log('🔗 Conectando com API:', API_BASE_URL);
  console.log('📱 Login social disponível');
}

/**
 * Inicializa os SDKs das redes sociais
 */
function initSocialSDKs() {
  // Google Sign-In SDK
  if (typeof gapi !== 'undefined') {
    initGoogleSignIn();
  } else {
    // Carrega o Google SDK se não estiver disponível
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.onload = initGoogleSignIn;
    document.head.appendChild(script);
  }
  
  // Facebook SDK
  if (typeof FB === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/pt_BR/sdk.js';
    script.onload = function() {
      FB.init({
        appId: SOCIAL_CONFIG.FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      console.log('Facebook SDK inicializado');
    };
    document.head.appendChild(script);
  }
}

// ========================================
// EXPOSIÇÃO DE FUNÇÕES GLOBAIS
// ========================================

// Expõe funções para uso em outras páginas
window.AuthSystem = {
  checkUserSession,
  logoutUser,
  redirectUser,
  showMessage,
  API_BASE_URL
};

// ========================================
// INICIALIZAÇÃO
// ========================================

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 