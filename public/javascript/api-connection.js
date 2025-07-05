// =====================================================
// CONEXÃO COM APIs - DOCE SENSACOES
// =====================================================

// Configuração da API
const API_BASE_URL = 'https://doce-sensacoes-backend-17.onrender.com/api';

// Classe para gerenciar conexões com a API
class DoceSensacoesAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('auth_token');
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            }
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }
            
            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    }

    // Buscar todos os produtos
    async getProducts() {
        return this.request('/products');
    }

    // Buscar produtos em destaque
    async getFeaturedProducts() {
        return this.request('/products/featured');
    }

    // Buscar categorias
    async getCategories() {
        return this.request('/products/categories');
    }

    // Login
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (response.token) {
            this.token = response.token;
            localStorage.setItem('auth_token', response.token);
            localStorage.setItem('user_data', JSON.stringify(response.user));
        }
        
        return response;
    }

    // Logout
    logout() {
        this.token = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    }

    // Verificar se está logado
    isLoggedIn() {
        return !!this.token;
    }

    // Buscar dados do usuário
    getUserData() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    }
}

// Instância global da API
const api = new DoceSensacoesAPI();

// =====================================================
// FUNÇÕES PARA ATUALIZAR O FRONTEND
// =====================================================

// Função para carregar produtos na seção de menu
async function loadProducts() {
    try {
        console.log('🔄 Carregando produtos...');
        
        // Mostrar loading
        const dishesContainer = document.getElementById('dishes');
        if (dishesContainer) {
            dishesContainer.innerHTML = '<div class="loading">Carregando produtos...</div>';
        }

        // Buscar produtos da API
        const response = await api.getProducts();
        const products = response.products || [];

        console.log('✅ Produtos carregados:', products);

        // Atualizar a seção de menu
        if (dishesContainer && products.length > 0) {
            dishesContainer.innerHTML = products.map(product => `
                <div class="dish" data-product-id="${product.id}">
                    <div class="dish-heart">
                        <i class="fa-solid fa-heart"></i>
                    </div>

                    <img src="${product.image_url || 'images/dish.png'}" class="dish-image" alt="${product.name}">

                    <h3 class="dish-title">
                        ${product.name}
                    </h3>

                    <span class="dish-description">
                        ${product.description || 'Descrição não disponível'}
                    </span>

                    <div class="dish-rate">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <span>(5.0)</span>
                    </div>

                    <div class="dish-price">
                        <h4>R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}</h4>
                        <button class="btn-default add-to-cart" data-product-id="${product.id}">
                            <i class="fa-solid fa-basket-shopping"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            // Adicionar eventos aos botões de carrinho
            addCartEvents();
        } else if (dishesContainer) {
            dishesContainer.innerHTML = '<div class="no-products">Nenhum produto disponível no momento.</div>';
        }

    } catch (error) {
        console.error('❌ Erro ao carregar produtos:', error);
        
        if (dishesContainer) {
            dishesContainer.innerHTML = `
                <div class="error-message">
                    <p>Erro ao carregar produtos. Tente novamente mais tarde.</p>
                    <button onclick="loadProducts()" class="btn-default">Tentar novamente</button>
                </div>
            `;
        }
    }
}

// Função para adicionar eventos aos botões de carrinho
function addCartEvents() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const productId = this.getAttribute('data-product-id');
            const productName = this.closest('.dish').querySelector('.dish-title').textContent;
            const productPrice = this.closest('.dish').querySelector('.dish-price h4').textContent;
            
            addToCart(productId, productName, productPrice);
        });
    });
}

// Função para adicionar produto ao carrinho
function addToCart(productId, productName, productPrice) {
    // Verificar se o usuário está logado
    if (!api.isLoggedIn()) {
        alert('Faça login para adicionar produtos ao carrinho!');
        window.location.href = 'src/login.html';
        return;
    }

    // Aqui você pode implementar a lógica do carrinho
    console.log('🛒 Adicionando ao carrinho:', { productId, productName, productPrice });
    
    // Mostrar feedback visual
    const button = document.querySelector(`[data-product-id="${productId}"]`);
    if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i>';
        button.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.backgroundColor = '';
        }, 1000);
    }
    
    alert(`${productName} adicionado ao carrinho!`);
}

// Função para carregar produtos em destaque na página inicial
async function loadFeaturedProducts() {
    try {
        const response = await api.getFeaturedProducts();
        const featuredProducts = response.products || [];
        
        console.log('⭐ Produtos em destaque:', featuredProducts);
        
        // Aqui você pode atualizar a seção de destaque se existir
        // Por enquanto, vamos apenas logar
        
    } catch (error) {
        console.error('❌ Erro ao carregar produtos em destaque:', error);
    }
}

// Função para inicializar a conexão com a API
function initializeAPI() {
    console.log('🚀 Inicializando conexão com a API...');
    
    // Verificar se o backend está rodando
    fetch(`${API_BASE_URL.replace('/api', '')}`)
        .then(response => response.json())
        .then(data => {
            console.log('✅ Backend conectado:', data.message);
            
            // Carregar produtos quando a página carregar
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', loadProducts);
            } else {
                loadProducts();
            }
            
            // Carregar produtos em destaque
            loadFeaturedProducts();
        })
        .catch(error => {
            console.error('❌ Erro ao conectar com o backend:', error);
            console.log('💡 Verifique se a API está online em https://doce-sensacoes-backend-17.onrender.com');
        });
}

// =====================================================
// ESTILOS CSS PARA LOADING E ERROS
// =====================================================

const styles = `
<style>
.loading {
    text-align: center;
    padding: 40px;
    font-size: 18px;
    color: #666;
}

.no-products {
    text-align: center;
    padding: 40px;
    font-size: 16px;
    color: #999;
}

.error-message {
    text-align: center;
    padding: 40px;
    color: #dc3545;
}

.error-message p {
    margin-bottom: 15px;
}

.add-to-cart {
    transition: all 0.3s ease;
}

.add-to-cart:hover {
    transform: scale(1.05);
}
</style>
`;

// Adicionar estilos ao head
document.head.insertAdjacentHTML('beforeend', styles);

// =====================================================
// INICIALIZAÇÃO
// =====================================================

// Inicializar quando o documento estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAPI);
} else {
    initializeAPI();
}

// Exportar para uso global
window.DoceSensacoesAPI = api;
window.loadProducts = loadProducts; 