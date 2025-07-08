// ========================================
// SISTEMA DE CADASTRO - DOCE SENSACOES
// ========================================

// Configuração da API
const API_BASE_URL = 'https://doce-sensacoes-api.onrender.com/api';

// Configurações do sistema
const CADASTRO_CONFIG = {
  // Configurações de sessão
  SESSION_KEY: 'doce_sensacoes_user',
  TOKEN_KEY: 'auth_token',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas em ms
  
  // URLs de redirecionamento
  SUCCESS_REDIRECT: 'perfil.html',
  LOGIN_REDIRECT: 'login.html',
  
  // Mensagens
  MESSAGES: {
    SUCCESS: 'Cadastro realizado com sucesso! Redirecionando...',
    PASSWORDS_DONT_MATCH: 'As senhas não coincidem!',
    WEAK_PASSWORD: 'A senha deve ter pelo menos 6 caracteres!',
    INVALID_EMAIL: 'Por favor, insira um email válido!',
    EMPTY_FIELDS: 'Por favor, preencha todos os campos!',
    EMAIL_ALREADY_EXISTS: 'Este email já está cadastrado!',
    INVALID_NAME: 'O nome deve ter pelo menos 2 caracteres!',
    NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
    SERVER_ERROR: 'Erro no servidor. Tente novamente.'
  }
};

// ========================================
// FUNÇÕES DE VALIDAÇÃO
// ========================================

/**
 * Valida se um email é válido
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida se uma senha é forte o suficiente
 */
function isStrongPassword(password) {
  return password.length >= 6;
}

/**
 * Valida se um nome é válido
 */
function isValidName(name) {
  return name.trim().length >= 2;
}

/**
 * Valida os campos do formulário de cadastro
 */
function validateCadastroForm(formData) {
  const { nome, email, senha, confirmarSenha } = formData;
  
  // Verifica se os campos estão preenchidos
  if (!nome || !email || !senha || !confirmarSenha) {
    return { valid: false, message: CADASTRO_CONFIG.MESSAGES.EMPTY_FIELDS };
  }
  
  // Verifica se o nome é válido
  if (!isValidName(nome)) {
    return { valid: false, message: CADASTRO_CONFIG.MESSAGES.INVALID_NAME };
  }
  
  // Verifica se o email é válido
  if (!isValidEmail(email)) {
    return { valid: false, message: CADASTRO_CONFIG.MESSAGES.INVALID_EMAIL };
  }
  
  // Verifica se a senha é forte
  if (!isStrongPassword(senha)) {
    return { valid: false, message: CADASTRO_CONFIG.MESSAGES.WEAK_PASSWORD };
  }
  
  // Verifica se as senhas coincidem
  if (senha !== confirmarSenha) {
    return { valid: false, message: CADASTRO_CONFIG.MESSAGES.PASSWORDS_DONT_MATCH };
  }
  
  return { valid: true };
}

// ========================================
// FUNÇÕES DE AUTENTICAÇÃO
// ========================================

/**
 * Cria um novo usuário via API
 */
async function createNewUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: userData.nome,
        email: userData.email,
        password: userData.senha,
        phone: userData.phone || ''
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        success: false, 
        message: data.message || CADASTRO_CONFIG.MESSAGES.SERVER_ERROR 
      };
    }

    return { 
      success: true, 
      user: data.user, 
      token: data.token 
    };
  } catch (error) {
    console.error('Erro no cadastro:', error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { 
        success: false, 
        message: CADASTRO_CONFIG.MESSAGES.NETWORK_ERROR 
      };
    }
    
    return { 
      success: false, 
      message: CADASTRO_CONFIG.MESSAGES.SERVER_ERROR 
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
    expires: Date.now() + CADASTRO_CONFIG.SESSION_TIMEOUT
  };
  
  // Armazena a sessão no localStorage
  localStorage.setItem(CADASTRO_CONFIG.SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(CADASTRO_CONFIG.TOKEN_KEY, token);
  
  return session;
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
  const button = document.querySelector('#cadastroForm button[type="submit"]');
  
  if (button) {
    if (show) {
      button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cadastrando...';
      button.disabled = true;
    } else {
      button.innerHTML = 'Cadastrar';
      button.disabled = false;
    }
  }
}

/**
 * Redireciona o usuário
 */
function redirectUser(url) {
  setTimeout(() => {
    window.location.href = url;
  }, 1500);
}

// ========================================
// HANDLERS DE EVENTOS
// ========================================

/**
 * Manipula o envio do formulário de cadastro
 */
async function handleCadastroSubmit(event) {
  event.preventDefault();
  
  // Obtém os dados do formulário
  const formData = {
    nome: event.target.nome.value.trim(),
    email: event.target.email.value.trim(),
    senha: event.target.senha.value,
    confirmarSenha: event.target.confirmarSenha.value
  };
  
  // Valida o formulário
  const validation = validateCadastroForm(formData);
  if (!validation.valid) {
    showMessage(validation.message, 'error');
    return;
  }
  
  // Mostra loading
  toggleLoading(true);
  
  try {
    // Cria o novo usuário via API
    const result = await createNewUser(formData);
    
    if (result.success) {
      // Cria a sessão
      createUserSession(result.user, result.token);
      
      // Mostra mensagem de sucesso
      showMessage(CADASTRO_CONFIG.MESSAGES.SUCCESS, 'success');
      
      // Redireciona para o perfil
      redirectUser(CADASTRO_CONFIG.SUCCESS_REDIRECT);
    } else {
      // Mostra mensagem de erro
      showMessage(result.message, 'error');
      
      // Remove loading
      toggleLoading(false);
    }
  } catch (error) {
    console.error('Erro no cadastro:', error);
    showMessage(CADASTRO_CONFIG.MESSAGES.SERVER_ERROR, 'error');
    toggleLoading(false);
  }
}

/**
 * Manipula o link para login
 */
function handleLoginLink(event) {
  event.preventDefault();
  
  // Adiciona animação de transição
  const container = document.querySelector('.cadastro-container');
  if (container) {
    container.style.animation = 'fadeOut 0.5s ease forwards';
  }
  
  setTimeout(() => {
    window.location.href = CADASTRO_CONFIG.LOGIN_REDIRECT;
  }, 500);
}

// ========================================
// FUNÇÕES DE INICIALIZAÇÃO
// ========================================

/**
 * Verifica se o usuário já está logado
 */
function checkAlreadyLoggedIn() {
  const sessionData = localStorage.getItem(CADASTRO_CONFIG.SESSION_KEY);
  const token = localStorage.getItem(CADASTRO_CONFIG.TOKEN_KEY);
  
  if (sessionData && token) {
    try {
      const session = JSON.parse(sessionData);
      
      // Verifica se a sessão não expirou
      if (Date.now() <= session.expires) {
        // Se já está logado, redireciona para o perfil
        window.location.href = CADASTRO_CONFIG.SUCCESS_REDIRECT;
        return true;
      } else {
        // Remove sessão expirada
        localStorage.removeItem(CADASTRO_CONFIG.SESSION_KEY);
        localStorage.removeItem(CADASTRO_CONFIG.TOKEN_KEY);
      }
    } catch (error) {
      localStorage.removeItem(CADASTRO_CONFIG.SESSION_KEY);
      localStorage.removeItem(CADASTRO_CONFIG.TOKEN_KEY);
    }
  }
  
  return false;
}

// ========================================
// AUTENTICAÇÃO SOCIAL
// ========================================

const SOCIAL_CONFIG = {
  GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // Substitua pelo seu Client ID
  FACEBOOK_APP_ID: 'YOUR_FACEBOOK_APP_ID',   // Substitua pelo seu App ID
};

function initGoogleSignIn() {
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

async function handleGoogleSignup() {
  try {
    if (typeof gapi === 'undefined') {
      showMessage('Google Sign-In não disponível. Tente novamente.', 'error');
      return;
    }
    const auth2 = gapi.auth2.getAuthInstance();
    const googleUser = await auth2.signIn();
    const profile = googleUser.getBasicProfile();
    const idToken = googleUser.getAuthResponse().id_token;
    const userData = {
      name: profile.getName(),
      email: profile.getEmail(),
      avatar_url: profile.getImageUrl(),
      google_id: profile.getId(),
      id_token: idToken
    };
    const result = await authenticateSocialUser('google', userData);
    if (result.success) {
      createUserSession(result.user, result.token);
      showMessage('Cadastro com Google realizado com sucesso!', 'success');
      redirectUser(CADASTRO_CONFIG.SUCCESS_REDIRECT);
    } else {
      showMessage(result.message, 'error');
    }
  } catch (error) {
    console.error('Erro no cadastro Google:', error);
    showMessage('Erro ao cadastrar com Google. Tente novamente.', 'error');
  }
}

async function handleFacebookSignup() {
  try {
    if (typeof FB === 'undefined') {
      showMessage('Facebook SDK não disponível. Tente novamente.', 'error');
      return;
    }
    FB.login(function(response) {
      if (response.authResponse) {
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
              showMessage('Cadastro com Facebook realizado com sucesso!', 'success');
              redirectUser(CADASTRO_CONFIG.SUCCESS_REDIRECT);
            } else {
              showMessage(result.message, 'error');
            }
          });
        });
      } else {
        showMessage('Cadastro com Facebook cancelado.', 'info');
      }
    }, { scope: 'email,public_profile' });
  } catch (error) {
    console.error('Erro no cadastro Facebook:', error);
    showMessage('Erro ao cadastrar com Facebook. Tente novamente.', 'error');
  }
}

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
        message: data.message || `Erro no cadastro com ${provider}` 
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
// Atualizar initEventListeners para incluir botões sociais
// ========================================

function initEventListeners() {
  const cadastroForm = document.getElementById('cadastroForm');
  const loginLink = document.querySelector('.login-link a');
  const googleBtn = document.getElementById('googleSignup');
  const facebookBtn = document.getElementById('facebookSignup');

  if (cadastroForm) {
    cadastroForm.addEventListener('submit', handleCadastroSubmit);
  }
  if (loginLink) {
    loginLink.addEventListener('click', handleLoginLink);
  }
  if (googleBtn) {
    googleBtn.addEventListener('click', handleGoogleSignup);
  }
  if (facebookBtn) {
    facebookBtn.addEventListener('click', handleFacebookSignup);
  }
}

// ========================================
// Atualizar init para carregar SDKs sociais
// ========================================

function initSocialSDKs() {
  // Google Sign-In SDK
  if (typeof gapi !== 'undefined') {
    initGoogleSignIn();
  } else {
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

/**
 * Adiciona animações CSS
 */
function addAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.95); }
    }
    
    .cadastro-container {
      animation: slideInCadastro 0.7s forwards;
    }
    
    @keyframes slideInCadastro {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Função principal de inicialização
 */
function init() {
  if (checkAlreadyLoggedIn()) {
    return;
  }
  addAnimations();
  initEventListeners();
  initSocialSDKs();
  console.log('🚀 Sistema de Cadastro Doce Sensações inicializado!');
  console.log('🔗 Conectando com API:', API_BASE_URL);
  console.log('📱 Cadastro social disponível');
}

// ========================================
// EXPOSIÇÃO DE FUNÇÕES GLOBAIS
// ========================================

// Expõe funções para uso em outras páginas
window.CadastroSystem = {
  validateCadastroForm,
  createNewUser,
  createUserSession,
  showMessage,
  redirectUser,
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