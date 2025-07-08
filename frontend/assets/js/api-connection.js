// =====================================================
// CONEXÃO COM APIs - DOCE SENSACOES
// =====================================================

// Configuração da API
const API_CONFIG = {
  // URL base da API - servidor de produção
  BASE_URL: 'https://doce-sensacoes-api.onrender.com',
  
  // Endpoints
  ENDPOINTS: {
    // Autenticação
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PROFILE: '/api/auth/profile',
    
    // Produtos
    PRODUCTS: '/api/products',
    FEATURED_PRODUCTS: '/api/products/featured',
    
    // Pedidos
    ORDERS: '/api/orders',
    CREATE_ORDER: '/api/orders/create',
    
    // Health check
    HEALTH: '/health'
  },
  
  // Configurações de requisição
  REQUEST_CONFIG: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 10000 // 10 segundos
  }
};

// Função para fazer requisições à API
async function apiRequest(endpoint, options = {}) {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const config = {
    ...API_CONFIG.REQUEST_CONFIG,
    ...options,
    headers: {
      ...API_CONFIG.REQUEST_CONFIG.headers,
      ...options.headers
    }
  };

  // Adicionar token de autenticação se existir
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    console.log(`🌐 Fazendo requisição para: ${url}`);
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ Resposta da API:`, data);
    
    return data;
  } catch (error) {
    console.error(`❌ Erro na requisição para ${url}:`, error);
    throw error;
  }
}

// Função para testar conexão com a API
async function testApiConnection() {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.HEALTH);
    console.log('✅ Conexão com API estabelecida:', response);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com API:', error);
    return false;
  }
}

// Função para login
async function loginUser(email, password) {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (response.success) {
      // Salvar token e dados do usuário
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('doce_sensacoes_user', JSON.stringify({
        user: response.user,
        token: response.token,
        expires: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 dias
      }));
      
      return response;
    } else {
      throw new Error(response.message || 'Erro no login');
    }
  } catch (error) {
    console.error('❌ Erro no login:', error);
    throw error;
  }
}

// Função para carregar produtos
async function loadProducts() {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTS);
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.message || 'Erro ao carregar produtos');
    }
  } catch (error) {
    console.error('❌ Erro ao carregar produtos:', error);
    // Retornar produtos padrão em caso de erro
    return [
      {
        id: 1,
        name: 'Bolo de Chocolate',
        desc: 'Massa fofinha, recheio cremoso e cobertura de chocolate belga.',
        price: 45.00,
        img: 'assets/images/dish.png',
        category: 'Bolos'
      },
      {
        id: 2,
        name: 'Torta de Limão',
        desc: 'Base crocante, creme de limão e merengue maçaricado.',
        price: 38.00,
        img: 'assets/images/dish2.png',
        category: 'Tortas'
      },
      {
        id: 3,
        name: 'Brigadeiro Gourmet',
        desc: 'Caixa com 6 unidades de brigadeiro feito com chocolate premium.',
        price: 18.00,
        img: 'assets/images/dish3.png',
        category: 'Doces'
      },
      {
        id: 4,
        name: 'Cheesecake de Frutas Vermelhas',
        desc: 'Cremoso, com calda artesanal de frutas vermelhas.',
        price: 42.00,
        img: 'assets/images/dish4.png',
        category: 'Cheesecakes'
      }
    ];
  }
}

// Função para obter perfil do usuário
async function getUserProfile() {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.PROFILE);
    
    if (response.success) {
      return response.user;
    } else {
      throw new Error(response.message || 'Erro ao carregar perfil');
    }
  } catch (error) {
    console.error('❌ Erro ao carregar perfil:', error);
    throw error;
  }
}

// Exportar funções para uso global
window.API_CONFIG = API_CONFIG;
window.apiRequest = apiRequest;
window.testApiConnection = testApiConnection;
window.loginUser = loginUser;
window.loadProducts = loadProducts;
window.getUserProfile = getUserProfile;

// Testar conexão quando o script for carregado
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔌 Inicializando conexão com API...');
  testApiConnection();
}); 