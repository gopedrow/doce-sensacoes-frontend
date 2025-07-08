/**
 * 🔗 SISTEMA DE INTEGRAÇÃO FRONTEND-BACKEND - DOCE SENSACOES
 * Comunicação fluida e robusta entre frontend e backend
 */

class APIIntegration {
    constructor() {
        this.config = {
            BASE_URL: 'http://localhost:3000/api',
            TIMEOUT: 15000,
            RETRY_ATTEMPTS: 3,
            RETRY_DELAY: 1000,
            CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
            REQUEST_QUEUE: [],
            IS_PROCESSING: false
        };

        this.endpoints = {
            AUTH: {
                LOGIN: '/auth/login',
                REGISTER: '/auth/register',
                VALIDATE: '/auth/validate',
                PROFILE: '/auth/profile',
                LOGOUT: '/auth/logout'
            },
            PRODUCTS: {
                LIST: '/products',
                DETAIL: '/products/:id',
                CREATE: '/products',
                UPDATE: '/products/:id',
                DELETE: '/products/:id',
                FEATURED: '/products/featured',
                CATEGORIES: '/products/categories'
            },
            ORDERS: {
                LIST: '/orders',
                CREATE: '/orders',
                DETAIL: '/orders/:id',
                UPDATE: '/orders/:id',
                STATUS: '/orders/:id/status'
            },
            USERS: {
                PROFILE: '/users/profile',
                UPDATE: '/users/profile',
                PREFERENCES: '/users/preferences'
            }
        };

        this.cache = new Map();
        this.requestQueue = [];
        this.isOnline = navigator.onLine;

        this.init();
    }

    /**
     * Inicializa o sistema de integração
     */
    init() {
        console.log('🔗 Inicializando Sistema de Integração API...');
        
        // Monitora conectividade
        this.setupConnectivityMonitoring();
        
        // Configura interceptors
        this.setupInterceptors();
        
        // Configura cache
        this.setupCache();
        
        // Configura fila de requisições
        this.setupRequestQueue();
        
        // Configura eventos
        this.setupEvents();
        
        console.log('✅ Sistema de Integração API inicializado!');
    }

    /**
     * Monitora conectividade
     */
    setupConnectivityMonitoring() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.processRequestQueue();
            this.notifyConnectivityChange(true);
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.notifyConnectivityChange(false);
        });

        // Verifica conectividade periodicamente
        setInterval(() => {
            this.checkConnectivity();
        }, 30000);
    }

    /**
     * Configura interceptors
     */
    setupInterceptors() {
        // Interceptor de requisição
        this.requestInterceptor = (config) => {
            // Adiciona token de autenticação
            const token = this.getAuthToken();
            if (token) {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`
                };
            }

            // Adiciona headers padrão
            config.headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...config.headers
            };

            // Adiciona timestamp
            config.timestamp = Date.now();

            return config;
        };

        // Interceptor de resposta
        this.responseInterceptor = (response) => {
            // Processa resposta
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        };

        // Interceptor de erro
        this.errorInterceptor = (error) => {
            console.error('❌ Erro na API:', error);
            
            // Retry automático para erros de rede
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                return this.retryRequest(error.config);
            }
            
            // Tratamento específico de erros
            this.handleSpecificErrors(error);
            
            throw error;
        };
    }

    /**
     * Configura cache
     */
    setupCache() {
        // Limpa cache expirado periodicamente
        setInterval(() => {
            this.cleanExpiredCache();
        }, 60000); // A cada minuto
    }

    /**
     * Configura fila de requisições
     */
    setupRequestQueue() {
        // Processa fila quando online
        if (this.isOnline) {
            this.processRequestQueue();
        }
    }

    /**
     * Configura eventos
     */
    setupEvents() {
        // Evento de mudança de autenticação
        document.addEventListener('authChange', (e) => {
            this.handleAuthChange(e.detail);
        });

        // Evento de mudança de conectividade
        document.addEventListener('connectivityChange', (e) => {
            this.handleConnectivityChange(e.detail);
        });
    }

    /**
     * Faz requisição com retry e cache
     */
    async request(endpoint, options = {}) {
        const config = {
            method: 'GET',
            headers: {},
            ...options
        };

        // Aplica interceptor de requisição
        const interceptedConfig = this.requestInterceptor(config);

        // Verifica cache para GET requests
        if (config.method === 'GET') {
            const cached = this.getCachedResponse(endpoint, interceptedConfig);
            if (cached) {
                return cached;
            }
        }

        // Adiciona à fila se offline
        if (!this.isOnline && config.method !== 'GET') {
            return this.addToRequestQueue(endpoint, interceptedConfig);
        }

        try {
            const response = await this.makeRequest(endpoint, interceptedConfig);
            const data = this.responseInterceptor(response);

            // Cache para GET requests
            if (config.method === 'GET') {
                this.cacheResponse(endpoint, interceptedConfig, data);
            }

            return data;

        } catch (error) {
            return this.errorInterceptor(error);
        }
    }

    /**
     * Faz requisição HTTP
     */
    async makeRequest(endpoint, config) {
        const url = this.buildURL(endpoint);
        
        const fetchConfig = {
            method: config.method,
            headers: config.headers,
            timeout: this.config.TIMEOUT
        };

        // Adiciona body para POST/PUT/PATCH
        if (['POST', 'PUT', 'PATCH'].includes(config.method)) {
            fetchConfig.body = JSON.stringify(config.data || config.body);
        }

        return fetch(url, fetchConfig);
    }

    /**
     * Constrói URL
     */
    buildURL(endpoint) {
        // Substitui parâmetros na URL
        let url = endpoint;
        if (endpoint.includes(':')) {
            const params = endpoint.match(/:[^/]+/g);
            params?.forEach(param => {
                const key = param.slice(1);
                const value = this.config.params?.[key] || '';
                url = url.replace(param, value);
            });
        }

        return `${this.config.BASE_URL}${url}`;
    }

    /**
     * Retry de requisição
     */
    async retryRequest(config, attempt = 1) {
        if (attempt > this.config.RETRY_ATTEMPTS) {
            throw new Error('Número máximo de tentativas excedido');
        }

        await new Promise(resolve => 
            setTimeout(resolve, this.config.RETRY_DELAY * attempt)
        );

        try {
            return await this.makeRequest(config.endpoint, config);
        } catch (error) {
            return this.retryRequest(config, attempt + 1);
        }
    }

    /**
     * Gerencia cache
     */
    getCachedResponse(endpoint, config) {
        const key = this.generateCacheKey(endpoint, config);
        const cached = this.cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < this.config.CACHE_DURATION) {
            return cached.data;
        }
        
        return null;
    }

    cacheResponse(endpoint, config, data) {
        const key = this.generateCacheKey(endpoint, config);
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    generateCacheKey(endpoint, config) {
        return `${endpoint}-${JSON.stringify(config)}`;
    }

    cleanExpiredCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.config.CACHE_DURATION) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Gerencia fila de requisições
     */
    addToRequestQueue(endpoint, config) {
        const queueItem = {
            endpoint,
            config,
            timestamp: Date.now(),
            id: Date.now() + Math.random()
        };

        this.requestQueue.push(queueItem);
        this.saveRequestQueue();

        return new Promise((resolve, reject) => {
            queueItem.resolve = resolve;
            queueItem.reject = reject;
        });
    }

    async processRequestQueue() {
        if (this.config.IS_PROCESSING || !this.isOnline) return;

        this.config.IS_PROCESSING = true;

        while (this.requestQueue.length > 0) {
            const item = this.requestQueue.shift();
            
            try {
                const result = await this.request(item.endpoint, item.config);
                item.resolve(result);
            } catch (error) {
                item.reject(error);
            }
        }

        this.config.IS_PROCESSING = false;
        this.saveRequestQueue();
    }

    saveRequestQueue() {
        localStorage.setItem('api_request_queue', JSON.stringify(this.requestQueue));
    }

    loadRequestQueue() {
        const saved = localStorage.getItem('api_request_queue');
        if (saved) {
            this.requestQueue = JSON.parse(saved);
        }
    }

    /**
     * Métodos específicos da API
     */

    // Autenticação
    async login(credentials) {
        return this.request(this.endpoints.AUTH.LOGIN, {
            method: 'POST',
            data: credentials
        });
    }

    async register(userData) {
        return this.request(this.endpoints.AUTH.REGISTER, {
            method: 'POST',
            data: userData
        });
    }

    async validateToken() {
        return this.request(this.endpoints.AUTH.VALIDATE, {
            method: 'POST'
        });
    }

    async getProfile() {
        return this.request(this.endpoints.AUTH.PROFILE);
    }

    async logout() {
        return this.request(this.endpoints.AUTH.LOGOUT, {
            method: 'POST'
        });
    }

    // Produtos
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const endpoint = queryString ? `${this.endpoints.PRODUCTS.LIST}?${queryString}` : this.endpoints.PRODUCTS.LIST;
        
        return this.request(endpoint);
    }

    async getProduct(id) {
        return this.request(this.endpoints.PRODUCTS.DETAIL.replace(':id', id));
    }

    async createProduct(productData) {
        return this.request(this.endpoints.PRODUCTS.CREATE, {
            method: 'POST',
            data: productData
        });
    }

    async updateProduct(id, productData) {
        return this.request(this.endpoints.PRODUCTS.UPDATE.replace(':id', id), {
            method: 'PUT',
            data: productData
        });
    }

    async deleteProduct(id) {
        return this.request(this.endpoints.PRODUCTS.DELETE.replace(':id', id), {
            method: 'DELETE'
        });
    }

    async getFeaturedProducts() {
        return this.request(this.endpoints.PRODUCTS.FEATURED);
    }

    async getCategories() {
        return this.request(this.endpoints.PRODUCTS.CATEGORIES);
    }

    // Pedidos
    async getOrders() {
        return this.request(this.endpoints.ORDERS.LIST);
    }

    async createOrder(orderData) {
        return this.request(this.endpoints.ORDERS.CREATE, {
            method: 'POST',
            data: orderData
        });
    }

    async getOrder(id) {
        return this.request(this.endpoints.ORDERS.DETAIL.replace(':id', id));
    }

    async updateOrder(id, orderData) {
        return this.request(this.endpoints.ORDERS.UPDATE.replace(':id', id), {
            method: 'PUT',
            data: orderData
        });
    }

    async updateOrderStatus(id, status) {
        return this.request(this.endpoints.ORDERS.STATUS.replace(':id', id), {
            method: 'PATCH',
            data: { status }
        });
    }

    // Usuários
    async updateProfile(profileData) {
        return this.request(this.endpoints.USERS.UPDATE, {
            method: 'PUT',
            data: profileData
        });
    }

    async getPreferences() {
        return this.request(this.endpoints.USERS.PREFERENCES);
    }

    async updatePreferences(preferences) {
        return this.request(this.endpoints.USERS.PREFERENCES, {
            method: 'PUT',
            data: preferences
        });
    }

    /**
     * Handlers de eventos
     */
    handleAuthChange(detail) {
        if (!detail.isAuthenticated) {
            // Limpa cache quando usuário faz logout
            this.cache.clear();
        }
    }

    handleConnectivityChange(detail) {
        if (detail.isOnline) {
            this.processRequestQueue();
        }
    }

    /**
     * Tratamento específico de erros
     */
    handleSpecificErrors(error) {
        if (error.message.includes('401')) {
            // Token expirado
            this.handleTokenExpired();
        } else if (error.message.includes('403')) {
            // Acesso negado
            this.handleAccessDenied();
        } else if (error.message.includes('404')) {
            // Recurso não encontrado
            this.handleNotFound();
        } else if (error.message.includes('500')) {
            // Erro do servidor
            this.handleServerError();
        }
    }

    handleTokenExpired() {
        // Limpa dados de autenticação
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Redireciona para login
        window.location.href = '/login.html';
    }

    handleAccessDenied() {
        this.showNotification('Acesso negado. Verifique suas permissões.', 'error');
    }

    handleNotFound() {
        this.showNotification('Recurso não encontrado.', 'warning');
    }

    handleServerError() {
        this.showNotification('Erro no servidor. Tente novamente mais tarde.', 'error');
    }

    /**
     * Utilitários
     */
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    checkConnectivity() {
        fetch(`${this.config.BASE_URL}/health`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Backend não respondeu');
                }
            })
            .catch(error => {
                console.warn('⚠️ Problema de conectividade:', error.message);
            });
    }

    notifyConnectivityChange(isOnline) {
        const event = new CustomEvent('apiConnectivityChange', {
            detail: { isOnline, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    showNotification(message, type = 'info') {
        const event = new CustomEvent('showNotification', {
            detail: { message, type }
        });
        document.dispatchEvent(event);
    }
}

// Inicializa o sistema de integração
const apiIntegration = new APIIntegration();

// Exporta para uso global
window.APIIntegration = APIIntegration;
window.api = apiIntegration; 