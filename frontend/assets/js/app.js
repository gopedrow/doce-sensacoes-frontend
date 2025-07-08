/**
 * 🚀 APLICAÇÃO PRINCIPAL - DOCE SENSACOES
 * Integração de todos os sistemas para máxima conectividade e fluidez
 */

class DoceSensacoesApp {
    constructor() {
        this.systems = {
            connectivity: null,
            compatibility: null,
            api: null,
            performance: null
        };

        this.state = {
            isInitialized: false,
            isOnline: navigator.onLine,
            currentPage: window.location.pathname,
            user: null,
            theme: 'light'
        };

        this.init();
    }

    /**
     * Inicializa a aplicação
     */
    async init() {
        console.log('🚀 Inicializando Doce Sensações...');
        
        try {
            // Inicializa sistemas em paralelo
            await this.initializeSystems();
            
            // Configura eventos globais
            this.setupGlobalEvents();
            
            // Configura roteamento
            this.setupRouting();
            
            // Configura tema
            this.setupTheme();
            
            // Carrega dados iniciais
            await this.loadInitialData();
            
            // Marca como inicializada
            this.state.isInitialized = true;
            
            // Dispara evento de inicialização
            this.dispatchEvent('appInitialized', { timestamp: Date.now() });
            
            console.log('✅ Doce Sensações inicializada com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * Inicializa todos os sistemas
     */
    async initializeSystems() {
        // Sistema de Conectividade
        this.systems.connectivity = new ConnectivityManager();
        
        // Sistema de Compatibilidade
        this.systems.compatibility = new CompatibilityManager();
        
        // Sistema de API
        this.systems.api = new APIIntegration();
        
        // Sistema de Performance
        this.systems.performance = new PerformanceManager();
        
        // Aguarda todos os sistemas estarem prontos
        await this.waitForSystems();
    }

    /**
     * Aguarda sistemas estarem prontos
     */
    async waitForSystems() {
        const systems = [
            this.systems.connectivity,
            this.systems.compatibility,
            this.systems.api,
            this.systems.performance
        ];

        // Aguarda todos os sistemas
        await Promise.all(systems.map(system => {
            return new Promise(resolve => {
                if (system && system.init) {
                    resolve();
                } else {
                    setTimeout(resolve, 100);
                }
            });
        }));
    }

    /**
     * Configura eventos globais
     */
    setupGlobalEvents() {
        // Eventos de conectividade
        document.addEventListener('connectivityChange', (e) => {
            this.handleConnectivityChange(e.detail);
        });

        // Eventos de autenticação
        document.addEventListener('authChange', (e) => {
            this.handleAuthChange(e.detail);
        });

        // Eventos de performance
        document.addEventListener('performanceMetric', (e) => {
            this.handlePerformanceMetric(e.detail);
        });

        // Eventos de erro
        document.addEventListener('performanceError', (e) => {
            this.handlePerformanceError(e.detail);
        });

        // Eventos de navegação
        document.addEventListener('pageNavigation', (e) => {
            this.handlePageNavigation(e.detail);
        });

        // Eventos de notificação
        document.addEventListener('showNotification', (e) => {
            this.showNotification(e.detail.message, e.detail.type);
        });

        // Eventos de API
        document.addEventListener('apiConnectivityChange', (e) => {
            this.handleAPIConnectivityChange(e.detail);
        });
    }

    /**
     * Configura roteamento
     */
    setupRouting() {
        // Roteamento baseado em hash para SPA
        this.router = {
            routes: {
                '/': 'index.html',
                '/login': 'login.html',
                '/cadastro': 'cadastro.html',
                '/perfil': 'perfil.html'
            },
            
            navigate: (path) => {
                const route = this.router.routes[path] || 'index.html';
                this.loadPage(route);
            },
            
            init: () => {
                // Navegação inicial
                const path = window.location.pathname;
                this.router.navigate(path);
                
                // Intercepta cliques em links
                document.addEventListener('click', (e) => {
                    const link = e.target.closest('a');
                    if (link && link.href && link.href.startsWith(window.location.origin)) {
                        e.preventDefault();
                        const path = new URL(link.href).pathname;
                        this.router.navigate(path);
                    }
                });
            }
        };

        this.router.init();
    }

    /**
     * Configura tema
     */
    setupTheme() {
        // Detecta preferência do usuário
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        this.state.theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        // Aplica tema
        this.applyTheme(this.state.theme);
        
        // Listener para mudanças de preferência
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    /**
     * Aplica tema
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.state.theme = theme;
        
        // Dispara evento
        this.dispatchEvent('themeChange', { theme });
    }

    /**
     * Carrega dados iniciais
     */
    async loadInitialData() {
        try {
            // Carrega dados do usuário se logado
            const token = localStorage.getItem('authToken');
            if (token) {
                const userData = await this.systems.api.getProfile();
                this.state.user = userData;
                this.updateUserInterface(userData);
            }
            
            // Carrega produtos em destaque
            await this.loadFeaturedProducts();
            
            // Carrega configurações
            await this.loadSettings();
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar dados iniciais:', error);
        }
    }

    /**
     * Carrega produtos em destaque
     */
    async loadFeaturedProducts() {
        try {
            const products = await this.systems.api.getFeaturedProducts();
            this.updateProductsInterface(products);
        } catch (error) {
            console.warn('⚠️ Erro ao carregar produtos em destaque:', error);
        }
    }

    /**
     * Carrega configurações
     */
    async loadSettings() {
        try {
            const settings = localStorage.getItem('appSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.applySettings(parsed);
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar configurações:', error);
        }
    }

    /**
     * Carrega página
     */
    async loadPage(pagePath) {
        try {
            // Mostra loading
            this.showPageLoader();
            
            // Carrega página
            const response = await fetch(pagePath);
            const html = await response.text();
            
            // Atualiza conteúdo
            this.updatePageContent(html);
            
            // Atualiza URL
            window.history.pushState({ page: pagePath }, '', pagePath);
            
            // Atualiza estado
            this.state.currentPage = pagePath;
            
            // Executa scripts da página
            this.executePageScripts(html);
            
            // Esconde loading
            this.hidePageLoader();
            
            // Dispara evento
            this.dispatchEvent('pageLoaded', { page: pagePath });
            
        } catch (error) {
            console.error('❌ Erro ao carregar página:', error);
            this.showError('Erro ao carregar página. Tente novamente.');
        }
    }

    /**
     * Atualiza conteúdo da página
     */
    updatePageContent(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newContent = doc.querySelector('main') || doc.body;
        
        const currentContent = document.querySelector('main') || document.body;
        currentContent.innerHTML = newContent.innerHTML;
    }

    /**
     * Executa scripts da página
     */
    executePageScripts(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
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
     * Handlers de eventos
     */
    handleConnectivityChange(detail) {
        this.state.isOnline = detail.isOnline;
        
        if (detail.isOnline) {
            this.showNotification('Conectividade restaurada!', 'success');
            this.syncOfflineData();
        } else {
            this.showNotification('Sem conectividade. Modo offline ativado.', 'warning');
        }
    }

    handleAuthChange(detail) {
        this.state.user = detail.user;
        this.updateUserInterface(detail.user);
        
        if (detail.isAuthenticated) {
            this.showNotification('Login realizado com sucesso!', 'success');
        } else {
            this.showNotification('Logout realizado.', 'info');
        }
    }

    handlePerformanceMetric(detail) {
        // Log da métrica
        console.log(`📊 ${detail.name}: ${detail.value}`);
        
        // Alerta para métricas ruins
        if (detail.name === 'LCP' && detail.value > 2500) {
            console.warn('⚠️ LCP muito alto:', detail.value);
        }
    }

    handlePerformanceError(detail) {
        console.error(`❌ Erro de performance: ${detail.type}`, detail.error);
        
        // Reporta erro
        if (window.Sentry) {
            Sentry.captureException(detail.error);
        }
    }

    handlePageNavigation(detail) {
        // Atualiza breadcrumb
        this.updateBreadcrumb(detail.url);
        
        // Scroll para topo
        window.scrollTo(0, 0);
    }

    handleAPIConnectivityChange(detail) {
        if (detail.isOnline) {
            this.retryFailedRequests();
        }
    }

    /**
     * Utilitários
     */
    showPageLoader() {
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

    hidePageLoader() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Posiciona no canto superior direito
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Anima entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove após 5 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    updateUserInterface(user) {
        // Atualiza elementos da interface baseado no usuário
        const userElements = document.querySelectorAll('[data-user]');
        userElements.forEach(element => {
            const field = element.dataset.user;
            if (user && user[field]) {
                element.textContent = user[field];
            }
        });
        
        // Atualiza visibilidade de elementos
        const authElements = document.querySelectorAll('[data-auth]');
        authElements.forEach(element => {
            const required = element.dataset.auth === 'required';
            const isVisible = user ? required : !required;
            element.style.display = isVisible ? '' : 'none';
        });
    }

    updateProductsInterface(products) {
        // Atualiza interface de produtos
        const productsContainer = document.querySelector('#products-container');
        if (productsContainer && products.length > 0) {
            // Implementar atualização de produtos
        }
    }

    updateBreadcrumb(url) {
        const breadcrumb = document.querySelector('.breadcrumb');
        if (breadcrumb) {
            const path = url.split('/').filter(Boolean);
            breadcrumb.innerHTML = path.map((segment, index) => {
                const isLast = index === path.length - 1;
                return `<span class="breadcrumb-item ${isLast ? 'active' : ''}">${segment}</span>`;
            }).join(' > ');
        }
    }

    applySettings(settings) {
        // Aplica configurações
        Object.entries(settings).forEach(([key, value]) => {
            switch (key) {
                case 'theme':
                    this.applyTheme(value);
                    break;
                case 'notifications':
                    this.setupNotifications(value);
                    break;
                case 'accessibility':
                    this.setupAccessibility(value);
                    break;
            }
        });
    }

    setupNotifications(enabled) {
        if (enabled && 'Notification' in window) {
            Notification.requestPermission();
        }
    }

    setupAccessibility(settings) {
        // Aplica configurações de acessibilidade
        if (settings.highContrast) {
            document.documentElement.classList.add('high-contrast');
        }
        
        if (settings.reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        }
    }

    syncOfflineData() {
        // Sincroniza dados offline
        const offlineData = localStorage.getItem('offlineData');
        if (offlineData) {
            try {
                const data = JSON.parse(offlineData);
                // Implementar sincronização
                localStorage.removeItem('offlineData');
            } catch (error) {
                console.warn('⚠️ Erro ao sincronizar dados offline:', error);
            }
        }
    }

    retryFailedRequests() {
        // Reexecuta requisições que falharam
        if (this.systems.api && this.systems.api.processRequestQueue) {
            this.systems.api.processRequestQueue();
        }
    }

    handleInitializationError(error) {
        console.error('❌ Erro crítico na inicialização:', error);
        
        // Mostra tela de erro
        this.showErrorScreen(error);
        
        // Reporta erro
        if (window.Sentry) {
            Sentry.captureException(error);
        }
    }

    showErrorScreen(error) {
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; text-align: center; padding: 20px;">
                <h1>😔 Ops! Algo deu errado</h1>
                <p>Houve um problema ao carregar a aplicação.</p>
                <button onclick="location.reload()" style="background: var(--color-primary-6); color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-top: 20px;">
                    Tentar Novamente
                </button>
            </div>
        `;
    }

    dispatchEvent(name, detail) {
        const event = new CustomEvent(name, { detail });
        document.dispatchEvent(event);
    }

    /**
     * Getters para informações da aplicação
     */
    getState() {
        return this.state;
    }

    getSystems() {
        return this.systems;
    }

    isInitialized() {
        return this.state.isInitialized;
    }

    isOnline() {
        return this.state.isOnline;
    }

    getCurrentUser() {
        return this.state.user;
    }

    getCurrentTheme() {
        return this.state.theme;
    }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DoceSensacoesApp();
});

// Exporta para uso global
window.DoceSensacoesApp = DoceSensacoesApp; 