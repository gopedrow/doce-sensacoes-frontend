/**
 * 🌐 SISTEMA DE COMPATIBILIDADE E ACESSIBILIDADE - DOCE SENSACOES
 * Garante funcionamento em todos os navegadores e dispositivos
 */

class CompatibilityManager {
    constructor() {
        this.browser = this.detectBrowser();
        this.device = this.detectDevice();
        this.features = this.detectFeatures();
        this.accessibility = this.initAccessibility();
        
        this.init();
    }

    /**
     * Inicializa o sistema de compatibilidade
     */
    init() {
        console.log('🌐 Inicializando Sistema de Compatibilidade...');
        
        // Aplica polyfills necessários
        this.applyPolyfills();
        
        // Configura acessibilidade
        this.setupAccessibility();
        
        // Configura responsividade
        this.setupResponsiveness();
        
        // Configura performance
        this.setupPerformance();
        
        // Configura SEO
        this.setupSEO();
        
        console.log('✅ Sistema de Compatibilidade inicializado!');
    }

    /**
     * Detecta o navegador
     */
    detectBrowser() {
        const userAgent = navigator.userAgent;
        let browser = 'unknown';
        let version = 'unknown';

        if (userAgent.includes('Chrome')) {
            browser = 'Chrome';
            version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'unknown';
        } else if (userAgent.includes('Firefox')) {
            browser = 'Firefox';
            version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'unknown';
        } else if (userAgent.includes('Safari')) {
            browser = 'Safari';
            version = userAgent.match(/Version\/(\d+)/)?.[1] || 'unknown';
        } else if (userAgent.includes('Edge')) {
            browser = 'Edge';
            version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'unknown';
        } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
            browser = 'Internet Explorer';
            version = userAgent.match(/MSIE (\d+)/)?.[1] || 'unknown';
        }

        return { name: browser, version: parseInt(version) || 0 };
    }

    /**
     * Detecta o dispositivo
     */
    detectDevice() {
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
        const isDesktop = !isMobile && !isTablet;

        return {
            type: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop',
            isMobile,
            isTablet,
            isDesktop,
            touchSupport: 'ontouchstart' in window,
            orientation: window.screen.orientation?.type || 'portrait'
        };
    }

    /**
     * Detecta recursos do navegador
     */
    detectFeatures() {
        return {
            // JavaScript
            es6: typeof Promise !== 'undefined' && typeof Map !== 'undefined',
            fetch: typeof fetch !== 'undefined',
            localStorage: typeof localStorage !== 'undefined',
            sessionStorage: typeof sessionStorage !== 'undefined',
            
            // CSS
            flexbox: this.testCSSFeature('display', 'flex'),
            grid: this.testCSSFeature('display', 'grid'),
            customProperties: this.testCSSFeature('--test', 'value'),
            transforms: this.testCSSFeature('transform', 'translateX(0)'),
            transitions: this.testCSSFeature('transition', 'all 0.3s'),
            
            // APIs
            serviceWorker: 'serviceWorker' in navigator,
            pushManager: 'PushManager' in window,
            geolocation: 'geolocation' in navigator,
            webGL: this.testWebGL(),
            webAudio: 'AudioContext' in window || 'webkitAudioContext' in window,
            
            // Performance
            intersectionObserver: 'IntersectionObserver' in window,
            resizeObserver: 'ResizeObserver' in window,
            mutationObserver: 'MutationObserver' in window
        };
    }

    /**
     * Testa recursos CSS
     */
    testCSSFeature(property, value) {
        const element = document.createElement('div');
        element.style[property] = value;
        return element.style[property] === value;
    }

    /**
     * Testa WebGL
     */
    testWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                     (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    /**
     * Aplica polyfills necessários
     */
    applyPolyfills() {
        // Polyfill para fetch
        if (!this.features.fetch) {
            this.loadPolyfill('fetch');
        }

        // Polyfill para Promise
        if (!this.features.es6) {
            this.loadPolyfill('promise');
        }

        // Polyfill para IntersectionObserver
        if (!this.features.intersectionObserver) {
            this.loadPolyfill('intersection-observer');
        }

        // Polyfill para ResizeObserver
        if (!this.features.resizeObserver) {
            this.loadPolyfill('resize-observer-polyfill');
        }

        // Polyfill para CSS Custom Properties
        if (!this.features.customProperties) {
            this.loadPolyfill('css-vars-ponyfill');
        }
    }

    /**
     * Carrega polyfill
     */
    loadPolyfill(name) {
        const script = document.createElement('script');
        script.src = `https://polyfill.io/v3/polyfill.min.js?features=${name}`;
        document.head.appendChild(script);
    }

    /**
     * Inicializa acessibilidade
     */
    initAccessibility() {
        return {
            highContrast: window.matchMedia('(prefers-contrast: high)').matches,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
            fontSize: this.getFontSize(),
            screenReader: this.detectScreenReader()
        };
    }

    /**
     * Obtém tamanho da fonte
     */
    getFontSize() {
        const testElement = document.createElement('div');
        testElement.style.fontSize = '1rem';
        testElement.style.position = 'absolute';
        testElement.style.visibility = 'hidden';
        document.body.appendChild(testElement);
        
        const fontSize = parseFloat(window.getComputedStyle(testElement).fontSize);
        document.body.removeChild(testElement);
        
        return fontSize;
    }

    /**
     * Detecta leitor de tela
     */
    detectScreenReader() {
        return new Promise((resolve) => {
            let screenReader = false;
            
            // Testa se há elementos com aria-live
            const ariaElements = document.querySelectorAll('[aria-live]');
            if (ariaElements.length > 0) {
                screenReader = true;
            }
            
            // Testa se há elementos com role
            const roleElements = document.querySelectorAll('[role]');
            if (roleElements.length > 0) {
                screenReader = true;
            }
            
            resolve(screenReader);
        });
    }

    /**
     * Configura acessibilidade
     */
    setupAccessibility() {
        // Adiciona atributos ARIA
        this.addARIA();
        
        // Configura navegação por teclado
        this.setupKeyboardNavigation();
        
        // Configura foco visual
        this.setupFocusManagement();
        
        // Configura contraste
        this.setupContrast();
        
        // Configura movimento reduzido
        this.setupReducedMotion();
    }

    /**
     * Adiciona atributos ARIA
     */
    addARIA() {
        // Botões
        document.querySelectorAll('button').forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', 'Botão');
            }
        });

        // Links
        document.querySelectorAll('a').forEach(link => {
            if (!link.getAttribute('aria-label') && !link.textContent.trim()) {
                link.setAttribute('aria-label', 'Link');
            }
        });

        // Imagens
        document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('alt')) {
                img.setAttribute('alt', 'Imagem');
            }
        });

        // Formulários
        document.querySelectorAll('form').forEach(form => {
            if (!form.getAttribute('aria-label')) {
                form.setAttribute('aria-label', 'Formulário');
            }
        });
    }

    /**
     * Configura navegação por teclado
     */
    setupKeyboardNavigation() {
        // Navegação por Tab
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Navegação por Enter/Space
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const target = e.target;
                if (target.tagName === 'BUTTON' || target.tagName === 'A') {
                    e.preventDefault();
                    target.click();
                }
            }
        });

        // Escape para fechar modais
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal.active');
                modals.forEach(modal => {
                    modal.classList.remove('active');
                });
            }
        });
    }

    /**
     * Configura gerenciamento de foco
     */
    setupFocusManagement() {
        // Adiciona estilos de foco
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 3px solid var(--color-primary-6) !important;
                outline-offset: 2px !important;
            }
            
            .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--color-primary-6);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 10000;
            }
            
            .skip-link:focus {
                top: 6px;
            }
        `;
        document.head.appendChild(style);

        // Adiciona skip links
        this.addSkipLinks();
    }

    /**
     * Adiciona skip links
     */
    addSkipLinks() {
        const skipLinks = [
            { href: '#main', text: 'Ir para o conteúdo principal' },
            { href: '#navigation', text: 'Ir para a navegação' },
            { href: '#footer', text: 'Ir para o rodapé' }
        ];

        skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.textContent = link.text;
            skipLink.className = 'skip-link';
            document.body.insertBefore(skipLink, document.body.firstChild);
        });
    }

    /**
     * Configura contraste
     */
    setupContrast() {
        if (this.accessibility.highContrast) {
            document.documentElement.classList.add('high-contrast');
        }

        // Adiciona toggle de contraste
        const contrastToggle = document.createElement('button');
        contrastToggle.textContent = 'Alto Contraste';
        contrastToggle.className = 'contrast-toggle';
        contrastToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('high-contrast');
        });
        
        // Adiciona ao header se existir
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(contrastToggle);
        }
    }

    /**
     * Configura movimento reduzido
     */
    setupReducedMotion() {
        if (this.accessibility.reducedMotion) {
            document.documentElement.classList.add('reduced-motion');
        }
    }

    /**
     * Configura responsividade
     */
    setupResponsiveness() {
        // Viewport meta tag
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover';
            document.head.appendChild(viewport);
        }

        // Orientação
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Resize
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    /**
     * Configura performance
     */
    setupPerformance() {
        // Lazy loading para imagens
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        }

        // Preload de recursos críticos
        this.preloadCriticalResources();

        // Service Worker
        if ('serviceWorker' in navigator) {
            this.registerServiceWorker();
        }
    }

    /**
     * Configura lazy loading
     */
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * Preload de recursos críticos
     */
    preloadCriticalResources() {
        const criticalResources = [
            '/assets/css/styles.css',
            '/assets/js/connectivity-manager.js',
            '/assets/images/hero.png'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 
                     resource.endsWith('.js') ? 'script' : 'image';
            document.head.appendChild(link);
        });
    }

    /**
     * Registra Service Worker
     */
    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registrado:', registration);
        } catch (error) {
            console.warn('⚠️ Erro ao registrar Service Worker:', error);
        }
    }

    /**
     * Configura SEO
     */
    setupSEO() {
        // Meta tags dinâmicas
        this.updateMetaTags();
        
        // Structured data
        this.addStructuredData();
        
        // Open Graph
        this.addOpenGraph();
    }

    /**
     * Atualiza meta tags
     */
    updateMetaTags() {
        const metaTags = {
            'description': 'Doce Sensações - Confeitaria artesanal com os melhores doces caseiros',
            'keywords': 'doces, confeitaria, brigadeiro, bolo, sobremesa, artesanal',
            'author': 'Doce Sensações',
            'robots': 'index, follow',
            'viewport': 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover'
        };

        Object.entries(metaTags).forEach(([name, content]) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = name;
                document.head.appendChild(meta);
            }
            meta.content = content;
        });
    }

    /**
     * Adiciona dados estruturados
     */
    addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": "Doce Sensações",
            "description": "Confeitaria artesanal com os melhores doces caseiros",
            "url": window.location.origin,
            "telephone": "+5562986483753",
            "address": {
                "@type": "PostalAddress",
                "addressCountry": "BR"
            },
            "servesCuisine": "Confeitaria",
            "priceRange": "$$"
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    /**
     * Adiciona Open Graph
     */
    addOpenGraph() {
        const ogTags = {
            'og:title': 'Doce Sensações',
            'og:description': 'Confeitaria artesanal com os melhores doces caseiros',
            'og:type': 'website',
            'og:url': window.location.href,
            'og:image': `${window.location.origin}/assets/images/hero.png`,
            'og:site_name': 'Doce Sensações'
        };

        Object.entries(ogTags).forEach(([property, content]) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.content = content;
        });
    }

    /**
     * Handlers de eventos
     */
    handleOrientationChange() {
        const orientation = window.screen.orientation?.type || 'portrait';
        document.documentElement.setAttribute('data-orientation', orientation);
        
        // Dispara evento customizado
        const event = new CustomEvent('orientationChange', { detail: { orientation } });
        document.dispatchEvent(event);
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Dispara evento customizado
        const event = new CustomEvent('resize', { detail: { width, height } });
        document.dispatchEvent(event);
    }

    /**
     * Utilitários
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Getters para informações do sistema
     */
    getBrowserInfo() {
        return this.browser;
    }

    getDeviceInfo() {
        return this.device;
    }

    getFeatureSupport() {
        return this.features;
    }

    getAccessibilityInfo() {
        return this.accessibility;
    }
}

// Inicializa o sistema de compatibilidade
const compatibilityManager = new CompatibilityManager();

// Exporta para uso global
window.CompatibilityManager = compatibilityManager;
window.compatibility = compatibilityManager; 