/**
 * 🚀 SISTEMA DE CONECTIVIDADE GLOBAL - DOCE SENSACOES
 * Gerencia todas as comunicações entre frontend, backend e componentes
 */

class ConnectivityManager {
    constructor() {
        this.config = {
            API_BASE_URL: 'https://doce-sensacoes-api.onrender.com/api',
            FRONTEND_BASE_URL: window.location.origin,
            TIMEOUT: 10000,
            RETRY_ATTEMPTS: 3,
            CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
            DEBUG_MODE: false
        };

        this.state = {
            isOnline: navigator.onLine,
            isAuthenticated: false,
            currentUser: null,
            pendingRequests: new Map(),
            cache: new Map(),
            eventListeners: new Map()
        };

        this.init();
    }

    /**
     * Inicializa o sistema de conectividade
     */
    init() {
        console.log('🔗 Inicializando Sistema de Conectividade Global...');
        
        // Monitora conectividade
        this.setupConnectivityMonitoring();
        
        // Monitora autenticação
        this.setupAuthMonitoring();
        
        // Setup de eventos globais
        this.setupGlobalEvents();
        
        // Verifica conectividade inicial
        this.checkConnectivity();
        
        console.log('✅ Sistema de Conectividade Global inicializado!');
    }

    /**
     * Monitora conectividade de rede
     */
    setupConnectivityMonitoring() {
        window.addEventListener('online', () => {
            this.state.isOnline = true;
            this.notifyConnectivityChange(true);
            this.retryPendingRequests();
        });

        window.addEventListener('offline', () => {
            this.state.isOnline = false;
            this.notifyConnectivityChange(false);
        });

        // Verifica conectividade periodicamente
        setInterval(() => {
            this.checkConnectivity();
        }, 30000); // A cada 30 segundos
    }

    /**
     * Monitora mudanças de autenticação
     */
    setupAuthMonitoring() {
        // Verifica token a cada 5 minutos
        setInterval(() => {
            this.validateAuthToken();
        }, 5 * 60 * 1000);

        // Monitora mudanças no localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'authToken' || e.key === 'userData') {
                this.updateAuthState();
            }
        });
    }

    /**
     * Configura eventos globais
     */
    setupGlobalEvents() {
        // Intercepta cliques em links para transições suaves
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && link.href.startsWith(this.config.FRONTEND_BASE_URL)) {
                e.preventDefault();
                this.navigateTo(link.href, true);
            }
        });

        // Intercepta formulários para validação
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.handleFormSubmission(e);
            }
        });

        // Gerencia histórico do navegador
        window.addEventListener('popstate', (e) => {
            this.handleNavigation(e.state);
        });
    }

    /**
     * Verifica conectividade com o backend
     */
    async checkConnectivity() {
        try {
            const response = await fetch(`${this.config.API_BASE_URL}/health`, {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                this.state.isOnline = true;
                this.notifyConnectivityChange(true);
            } else {
                throw new Error('Backend não respondeu corretamente');
            }
        } catch (error) {
            this.state.isOnline = false;
            this.notifyConnectivityChange(false);
            console.warn('⚠️ Problema de conectividade:', error.message);
        }
    }

    /**
     * Notifica mudanças de conectividade
     */
    notifyConnectivityChange(isOnline) {
        const event = new CustomEvent('connectivityChange', {
            detail: { isOnline, timestamp: Date.now() }
        });
        document.dispatchEvent(event);

        // Atualiza UI
        this.updateConnectivityUI(isOnline);
    }

    /**
     * Atualiza UI baseada na conectividade
     */
    updateConnectivityUI(isOnline) {
        const statusIndicator = document.getElementById('connectivity-status');
        if (statusIndicator) {
            statusIndicator.className = isOnline ? 'online' : 'offline';
            statusIndicator.textContent = isOnline ? '🟢 Online' : '🔴 Offline';
        }

        // Desabilita/habilita formulários
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, button, textarea');
            inputs.forEach(input => {
                input.disabled = !isOnline;
            });
        });
    }

    /**
     * Navegação fluida entre páginas
     */
    async navigateTo(url, smoothTransition = true) {
        try {
            if (smoothTransition) {
                this.showLoadingTransition();
            }

            // Carrega a página
            const response = await fetch(url);
            const html = await response.text();

            // Extrai o conteúdo principal
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('main') || doc.body;

            // Transição suave
            if (smoothTransition) {
                await this.smoothPageTransition(newContent);
            } else {
                document.body.innerHTML = newContent.innerHTML;
            }

            // Atualiza URL sem recarregar
            window.history.pushState({ url }, '', url);

            // Executa scripts da nova página
            this.executePageScripts(doc);

            // Dispara evento de navegação
            this.dispatchNavigationEvent(url);

        } catch (error) {
            console.error('❌ Erro na navegação:', error);
            this.showError('Erro ao carregar a página. Tente novamente.');
        } finally {
            if (smoothTransition) {
                this.hideLoadingTransition();
            }
        }
    }

    /**
     * Transição suave entre páginas
     */
    async smoothPageTransition(newContent) {
        const currentContent = document.querySelector('main') || document.body;
        
        // Fade out
        currentContent.style.transition = 'opacity 0.3s ease-out';
        currentContent.style.opacity = '0';

        await new Promise(resolve => setTimeout(resolve, 300));

        // Substitui conteúdo
        currentContent.innerHTML = newContent.innerHTML;
        currentContent.style.opacity = '1';
    }

    /**
     * Executa scripts da nova página
     */
    executePageScripts(doc) {
        const scripts = doc.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src) {
                // Script externo
                const newScript = document.createElement('script');
                newScript.src = script.src;
                document.head.appendChild(newScript);
            } else {
                // Script inline
                eval(script.textContent);
            }
        });
    }

    /**
     * Gerencia submissão de formulários
     */
    async handleFormSubmission(event) {
        const form = event.target;
        const formData = new FormData(form);
        const action = form.action || this.config.API_BASE_URL;
        const method = form.method || 'POST';

        try {
            // Validação local
            if (!this.validateForm(form)) {
                event.preventDefault();
                return;
            }

            // Mostra loading
            this.showFormLoading(form);

            // Envia dados
            const response = await this.makeRequest(action, {
                method,
                body: formData,
                headers: {
                    'Authorization': `Bearer ${this.getAuthToken()}`
                }
            });

            // Processa resposta
            await this.handleFormResponse(form, response);

        } catch (error) {
            console.error('❌ Erro no formulário:', error);
            this.showFormError(form, error.message);
        } finally {
            this.hideFormLoading(form);
        }
    }

    /**
     * Valida formulário
     */
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'Este campo é obrigatório');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        return isValid;
    }

    /**
     * Faz requisições com retry e cache
     */
    async makeRequest(url, options = {}) {
        const cacheKey = `${url}-${JSON.stringify(options)}`;
        
        // Verifica cache
        if (options.method === 'GET' && this.state.cache.has(cacheKey)) {
            const cached = this.state.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.config.CACHE_DURATION) {
                return cached.data;
            }
        }

        let lastError;
        
        for (let attempt = 1; attempt <= this.config.RETRY_ATTEMPTS; attempt++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    timeout: this.config.TIMEOUT,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                // Cache para GET requests
                if (options.method === 'GET') {
                    this.state.cache.set(cacheKey, {
                        data,
                        timestamp: Date.now()
                    });
                }

                return data;

            } catch (error) {
                lastError = error;
                
                if (attempt < this.config.RETRY_ATTEMPTS) {
                    await new Promise(resolve => 
                        setTimeout(resolve, 1000 * attempt)
                    );
                }
            }
        }

        throw lastError;
    }

    /**
     * Gerencia estado de autenticação
     */
    updateAuthState() {
        const token = this.getAuthToken();
        const userData = this.getUserData();

        this.state.isAuthenticated = !!token;
        this.state.currentUser = userData;

        // Notifica mudança de autenticação
        const event = new CustomEvent('authChange', {
            detail: { 
                isAuthenticated: this.state.isAuthenticated,
                user: this.state.currentUser
            }
        });
        document.dispatchEvent(event);

        // Atualiza UI
        this.updateAuthUI();
    }

    /**
     * Valida token de autenticação
     */
    async validateAuthToken() {
        const token = this.getAuthToken();
        if (!token) return;

        try {
            const response = await this.makeRequest(`${this.config.API_BASE_URL}/auth/validate`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.valid) {
                this.logout();
            }
        } catch (error) {
            console.warn('⚠️ Erro ao validar token:', error);
            this.logout();
        }
    }

    /**
     * Logout do usuário
     */
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.updateAuthState();
        this.navigateTo('/login.html');
    }

    /**
     * Utilitários
     */
    getAuthToken() {
        return localStorage.getItem('authToken');
    }

    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }

    showLoadingTransition() {
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p>Carregando...</p>
            </div>
        `;
        document.body.appendChild(loader);
    }

    hideLoadingTransition() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.remove();
        }
    }

    showError(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    dispatchNavigationEvent(url) {
        const event = new CustomEvent('pageNavigation', {
            detail: { url, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    retryPendingRequests() {
        this.state.pendingRequests.forEach((request, key) => {
            this.makeRequest(request.url, request.options)
                .then(request.resolve)
                .catch(request.reject);
        });
        this.state.pendingRequests.clear();
    }
}

// Inicializa o sistema global
const connectivityManager = new ConnectivityManager();

// Exporta para uso global
window.ConnectivityManager = connectivityManager;
window.connectivity = connectivityManager; 