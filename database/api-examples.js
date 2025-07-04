// =====================================================
// EXEMPLOS DE INTEGRAÇÃO API - DOCE SENSACOES
// =====================================================

// Configuração base da API
const API_BASE_URL = 'http://localhost:3000/api';
const API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
};

// =====================================================
// 1. AUTENTICAÇÃO
// =====================================================

// Login do usuário
async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Erro de conexão' };
  }
}

// Cadastro de usuário
async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    return { success: false, message: 'Erro de conexão' };
  }
}

// =====================================================
// 2. PRODUTOS
// =====================================================

// Buscar todos os produtos
async function getProducts(filters = {}) {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
      headers: API_CONFIG.headers
    });
    
    const data = await response.json();
    return { success: true, products: data.products };
  } catch (error) {
    return { success: false, message: 'Erro ao carregar produtos' };
  }
}

// Buscar produtos em destaque
async function getFeaturedProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/featured`, {
      headers: API_CONFIG.headers
    });
    
    const data = await response.json();
    return { success: true, products: data.products };
  } catch (error) {
    return { success: false, message: 'Erro ao carregar produtos em destaque' };
  }
}

// Buscar detalhes de um produto
async function getProductDetails(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      headers: API_CONFIG.headers
    });
    
    const data = await response.json();
    return { success: true, product: data.product };
  } catch (error) {
    return { success: false, message: 'Erro ao carregar produto' };
  }
}

// =====================================================
// 3. CARRINHO
// =====================================================

// Buscar itens do carrinho
async function getCartItems() {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: API_CONFIG.headers
    });
    
    const data = await response.json();
    return { success: true, items: data.items };
  } catch (error) {
    return { success: false, message: 'Erro ao carregar carrinho' };
  }
}

// Adicionar item ao carrinho
async function addToCart(productId, quantity = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ productId, quantity })
    });
    
    const data = await response.json();
    return { success: true, cart: data.cart };
  } catch (error) {
    return { success: false, message: 'Erro ao adicionar ao carrinho' };
  }
}

// Atualizar quantidade no carrinho
async function updateCartItem(productId, quantity) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/update`, {
      method: 'PUT',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ productId, quantity })
    });
    
    const data = await response.json();
    return { success: true, cart: data.cart };
  } catch (error) {
    return { success: false, message: 'Erro ao atualizar carrinho' };
  }
}

// Remover item do carrinho
async function removeFromCart(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: API_CONFIG.headers
    });
    
    const data = await response.json();
    return { success: true, cart: data.cart };
  } catch (error) {
    return { success: false, message: 'Erro ao remover do carrinho' };
  }
}

// =====================================================
// 4. PEDIDOS
// =====================================================

// Criar novo pedido
async function createOrder(orderData) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    return { success: true, order: data.order };
  } catch (error) {
    return { success: false, message: 'Erro ao criar pedido' };
  }
}

// Buscar histórico de pedidos
async function getOrderHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: API_CONFIG.headers
    });
    
    const data = await response.json();
    return { success: true, orders: data.orders };
  } catch (error) {
    return { success: false, message: 'Erro ao carregar pedidos' };
  }
}

// Buscar detalhes de um pedido
async function getOrderDetails(orderId) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: API_CONFIG.headers
    });
    
    const data = await response.json();
    return { success: true, order: data.order };
  } catch (error) {
    return { success: false, message: 'Erro ao carregar pedido' };
  }
}

// =====================================================
// 5. CUPONS
// =====================================================

// Validar cupom de desconto
async function validateCoupon(couponCode) {
  try {
    const response = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({ code: couponCode })
    });
    
    const data = await response.json();
    return { success: true, coupon: data.coupon };
  } catch (error) {
    return { success: false, message: 'Erro ao validar cupom' };
  }
}

// =====================================================
// 6. AVALIAÇÕES
// =====================================================

// Criar avaliação
async function createReview(reviewData) {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify(reviewData)
    });
    
    const data = await response.json();
    return { success: true, review: data.review };
  } catch (error) {
    return { success: false, message: 'Erro ao criar avaliação' };
  }
}

// =====================================================
// 7. PERFIL DO USUÁRIO
// =====================================================

// Buscar dados do perfil
async function getUserProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: API_CONFIG.headers
    });
    
    const data = await response.json();
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: 'Erro ao carregar perfil' };
  }
}

// Atualizar perfil
async function updateUserProfile(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: API_CONFIG.headers,
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, message: 'Erro ao atualizar perfil' };
  }
}

// =====================================================
// 8. EXEMPLO DE INTEGRAÇÃO COM FRONTEND ATUAL
// =====================================================

// Substituir dados simulados na página de perfil
async function loadUserDashboard() {
  // Carregar dados do usuário
  const userResult = await getUserProfile();
  if (userResult.success) {
    document.getElementById('user_infos').innerHTML = `
      <span class="item-description">${userResult.user.name}</span>
      <span class="item-description">Cliente VIP</span>
    `;
  }
  
  // Carregar histórico de pedidos
  const ordersResult = await getOrderHistory();
  if (ordersResult.success && ordersResult.orders.length > 0) {
    const lastOrder = ordersResult.orders[0];
    // Atualizar interface com dados reais
  }
}

// Substituir produtos simulados
async function loadProducts() {
  const result = await getProducts();
  if (result.success) {
    // Substituir cartProducts hardcoded pelos dados da API
    window.cartProducts = result.products;
    renderProducts(); // Função existente no frontend
  }
}

// Integrar carrinho com API
async function addProductToCart(productId) {
  const result = await addToCart(productId, 1);
  if (result.success) {
    // Atualizar interface do carrinho
    renderCartItems();
    showNotification('Produto adicionado ao carrinho!', 'success');
  } else {
    showNotification(result.message, 'error');
  }
}

// =====================================================
// 9. UTILITÁRIOS
// =====================================================

// Interceptor para adicionar token automaticamente
function setupApiInterceptors() {
  // Interceptar todas as requisições para adicionar token
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }
    return originalFetch(url, options);
  };
}

// Verificar se usuário está logado
function isUserLoggedIn() {
  return localStorage.getItem('token') !== null;
}

// Fazer logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

// Mostrar notificação
function showNotification(message, type = 'info') {
  // Implementar sistema de notificações
  console.log(`${type.toUpperCase()}: ${message}`);
}

// =====================================================
// 10. INICIALIZAÇÃO
// =====================================================

// Configurar API quando página carregar
document.addEventListener('DOMContentLoaded', function() {
  setupApiInterceptors();
  
  // Se estiver na página de perfil, carregar dados
  if (window.location.pathname.includes('perfil.html')) {
    loadUserDashboard();
  }
  
  // Se estiver na página de produtos, carregar produtos
  if (window.location.pathname.includes('index.html')) {
    loadProducts();
  }
}); 