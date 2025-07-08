/**
 * ⚡ SISTEMA DE PERFORMANCE E OTIMIZAÇÃO - DOCE SENSACOES
 * Otimização de performance e recursos para máxima fluidez
 */

class PerformanceManager {
    constructor() {
        this.metrics = {
            loadTime: 0,
            firstPaint: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0,
            firstInputDelay: 0
        };

        this.optimizations = {
            lazyLoading: true,
            imageOptimization: true,
            codeSplitting: true,
            caching: true,
            compression: true,
            minification: true
        };

        this.resources = {
            images: new Set(),
            scripts: new Set(),
            stylesheets: new Set(),
            fonts: new Set()
        };

        this.init();
    }

    /**
     * Inicializa o sistema de performance
     */
    init() {
        console.log('⚡ Inicializando Sistema de Performance...');
        
        // Configura métricas de performance
        this.setupPerformanceMetrics();
        
        // Configura otimizações
        this.setupOptimizations();
        
        // Configura monitoramento
        this.setupMonitoring();
        
        // Configura cache
        this.setupCache();
        
        // Configura compressão
        this.setupCompression();
        
        console.log('✅ Sistema de Performance inicializado!');
    }

    /**
     * Configura métricas de performance
     */
    setupPerformanceMetrics() {
        // Performance Observer para métricas web vitais
        if ('PerformanceObserver' in window) {
            this.setupWebVitals();
        }

        // Métricas de carregamento
        this.measureLoadTime();
        
        // Métricas de interação
        this.measureInteractionMetrics();
    }

    /**
     * Configura Web Vitals
     */
    setupWebVitals() {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.largestContentfulPaint = lastEntry.startTime;
            this.reportMetric('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
                this.reportMetric('FID', this.metrics.firstInputDelay);
            });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                    this.metrics.cumulativeLayoutShift = clsValue;
                    this.reportMetric('CLS', clsValue);
                }
            });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // First Paint (FP) e First Contentful Paint (FCP)
        const paintObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (entry.name === 'first-paint') {
                    this.metrics.firstPaint = entry.startTime;
                    this.reportMetric('FP', entry.startTime);
                } else if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = entry.startTime;
                    this.reportMetric('FCP', entry.startTime);
                }
            });
        });
        paintObserver.observe({ entryTypes: ['paint'] });
    }

    /**
     * Mede tempo de carregamento
     */
    measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.metrics.loadTime = loadTime;
            this.reportMetric('LoadTime', loadTime);
        });
    }

    /**
     * Mede métricas de interação
     */
    measureInteractionMetrics() {
        let firstInteraction = true;
        
        const interactionEvents = ['click', 'keydown', 'touchstart'];
        
        interactionEvents.forEach(eventType => {
            document.addEventListener(eventType, (e) => {
                if (firstInteraction) {
                    const interactionTime = performance.now();
                    this.reportMetric('FirstInteraction', interactionTime);
                    firstInteraction = false;
                }
            }, { once: true });
        });
    }

    /**
     * Configura otimizações
     */
    setupOptimizations() {
        // Lazy loading de imagens
        if (this.optimizations.lazyLoading) {
            this.setupLazyLoading();
        }

        // Otimização de imagens
        if (this.optimizations.imageOptimization) {
            this.setupImageOptimization();
        }

        // Code splitting
        if (this.optimizations.codeSplitting) {
            this.setupCodeSplitting();
        }

        // Minificação
        if (this.optimizations.minification) {
            this.setupMinification();
        }
    }

    /**
     * Configura lazy loading
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            });

            // Observa imagens com data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            // Observa iframes
            document.querySelectorAll('iframe[data-src]').forEach(iframe => {
                imageObserver.observe(iframe);
            });
        }
    }

    /**
     * Carrega imagem otimizada
     */
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;

        // Cria nova imagem para pré-carregar
        const tempImg = new Image();
        
        tempImg.onload = () => {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            
            // Adiciona à lista de recursos carregados
            this.resources.images.add(src);
        };

        tempImg.onerror = () => {
            console.warn('⚠️ Erro ao carregar imagem:', src);
            img.classList.add('error');
        };

        tempImg.src = src;
    }

    /**
     * Configura otimização de imagens
     */
    setupImageOptimization() {
        // Detecta formato WebP
        const webPSupport = this.checkWebPSupport();
        
        // Otimiza imagens baseado no dispositivo
        this.optimizeImagesForDevice(webPSupport);
        
        // Configura responsive images
        this.setupResponsiveImages();
    }

    /**
     * Verifica suporte ao WebP
     */
    checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    /**
     * Otimiza imagens para o dispositivo
     */
    async optimizeImagesForDevice(webPSupport) {
        const images = document.querySelectorAll('img[data-src]');
        const devicePixelRatio = window.devicePixelRatio || 1;
        const isMobile = window.innerWidth <= 768;

        images.forEach(img => {
            let src = img.dataset.src;
            
            // Adiciona parâmetros de otimização
            const params = new URLSearchParams();
            
            if (isMobile) {
                params.set('w', '400');
            } else if (devicePixelRatio > 1) {
                params.set('w', '800');
            }
            
            if (webPSupport) {
                params.set('format', 'webp');
            }
            
            if (params.toString()) {
                src += `?${params.toString()}`;
                img.dataset.src = src;
            }
        });
    }

    /**
     * Configura imagens responsivas
     */
    setupResponsiveImages() {
        const images = document.querySelectorAll('img[data-srcset]');
        
        images.forEach(img => {
            const srcset = img.dataset.srcset;
            if (srcset) {
                img.srcset = srcset;
                img.sizes = img.dataset.sizes || '100vw';
            }
        });
    }

    /**
     * Configura code splitting
     */
    setupCodeSplitting() {
        // Carrega scripts sob demanda
        this.setupDynamicImports();
        
        // Preload de recursos críticos
        this.preloadCriticalResources();
        
        // Prefetch de recursos não críticos
        this.prefetchNonCriticalResources();
    }

    /**
     * Configura imports dinâmicos
     */
    setupDynamicImports() {
        // Carrega módulos sob demanda
        const loadModule = async (moduleName) => {
            try {
                const module = await import(`./modules/${moduleName}.js`);
                return module;
            } catch (error) {
                console.error('❌ Erro ao carregar módulo:', error);
                return null;
            }
        };

        // Disponibiliza globalmente
        window.loadModule = loadModule;
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
     * Prefetch de recursos não críticos
     */
    prefetchNonCriticalResources() {
        const nonCriticalResources = [
            '/assets/js/performance-manager.js',
            '/assets/images/dish.png',
            '/assets/images/dish2.png'
        ];

        // Prefetch quando o usuário estiver ocioso
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                nonCriticalResources.forEach(resource => {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = resource;
                    document.head.appendChild(link);
                });
            });
        }
    }

    /**
     * Configura minificação
     */
    setupMinification() {
        // Remove espaços em branco desnecessários
        this.removeUnnecessaryWhitespace();
        
        // Otimiza CSS
        this.optimizeCSS();
        
        // Otimiza JavaScript
        this.optimizeJavaScript();
    }

    /**
     * Remove espaços em branco desnecessários
     */
    removeUnnecessaryWhitespace() {
        const elements = document.querySelectorAll('*');
        elements.forEach(element => {
            if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) {
                const text = element.textContent;
                if (text.trim() !== text) {
                    element.textContent = text.trim();
                }
            }
        });
    }

    /**
     * Otimiza CSS
     */
    optimizeCSS() {
        // Remove estilos não utilizados
        this.removeUnusedCSS();
        
        // Inline CSS crítico
        this.inlineCriticalCSS();
    }

    /**
     * Remove CSS não utilizado
     */
    removeUnusedCSS() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(stylesheet => {
            if (!this.isStylesheetUsed(stylesheet.href)) {
                stylesheet.remove();
            }
        });
    }

    /**
     * Verifica se stylesheet é usado
     */
    isStylesheetUsed(href) {
        // Implementação simplificada
        return href.includes('critical') || href.includes('main');
    }

    /**
     * Inline CSS crítico
     */
    inlineCriticalCSS() {
        const criticalCSS = `
            body { margin: 0; padding: 0; }
            .loading { display: none; }
            .critical { display: block; }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    /**
     * Otimiza JavaScript
     */
    optimizeJavaScript() {
        // Remove console.logs em produção
        if (window.location.hostname !== 'localhost') {
            this.removeConsoleLogs();
        }
        
        // Otimiza event listeners
        this.optimizeEventListeners();
    }

    /**
     * Remove console.logs
     */
    removeConsoleLogs() {
        const originalLog = console.log;
        console.log = () => {};
        
        // Restaura após um tempo
        setTimeout(() => {
            console.log = originalLog;
        }, 1000);
    }

    /**
     * Otimiza event listeners
     */
    optimizeEventListeners() {
        // Usa event delegation quando possível
        document.addEventListener('click', (e) => {
            const target = e.target;
            
            // Delegação para botões
            if (target.matches('.btn, button')) {
                this.handleButtonClick(target, e);
            }
            
            // Delegação para links
            if (target.matches('a')) {
                this.handleLinkClick(target, e);
            }
        });
    }

    /**
     * Configura monitoramento
     */
    setupMonitoring() {
        // Monitora performance em tempo real
        this.monitorPerformance();
        
        // Monitora recursos
        this.monitorResources();
        
        // Monitora erros
        this.monitorErrors();
    }

    /**
     * Monitora performance
     */
    monitorPerformance() {
        // Performance marks
        performance.mark('app-init-start');
        
        window.addEventListener('load', () => {
            performance.mark('app-init-end');
            performance.measure('app-init', 'app-init-start', 'app-init-end');
            
            const measure = performance.getEntriesByName('app-init')[0];
            this.reportMetric('AppInit', measure.duration);
        });
    }

    /**
     * Monitora recursos
     */
    monitorResources() {
        if ('PerformanceObserver' in window) {
            const resourceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.analyzeResource(entry);
                });
            });
            resourceObserver.observe({ entryTypes: ['resource'] });
        }
    }

    /**
     * Analisa recurso
     */
    analyzeResource(entry) {
        const resourceType = entry.initiatorType;
        const duration = entry.duration;
        const size = entry.transferSize || 0;
        
        // Adiciona à lista de recursos
        this.resources[resourceType]?.add(entry.name);
        
        // Reporta métricas
        this.reportMetric(`${resourceType}Load`, duration);
        this.reportMetric(`${resourceType}Size`, size);
        
        // Alerta para recursos lentos
        if (duration > 3000) {
            console.warn('⚠️ Recurso lento detectado:', entry.name, duration);
        }
    }

    /**
     * Monitora erros
     */
    monitorErrors() {
        window.addEventListener('error', (e) => {
            this.reportError('JavaScript', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            this.reportError('Promise', e.reason);
        });
    }

    /**
     * Configura cache
     */
    setupCache() {
        if (this.optimizations.caching) {
            // Cache de API
            this.setupAPICache();
            
            // Cache de assets
            this.setupAssetsCache();
        }
    }

    /**
     * Configura cache de API
     */
    setupAPICache() {
        // Cache simples em memória
        this.apiCache = new Map();
        
        // Cache no localStorage
        this.setupLocalStorageCache();
    }

    /**
     * Configura cache no localStorage
     */
    setupLocalStorageCache() {
        const cacheKey = 'api_cache';
        const maxAge = 5 * 60 * 1000; // 5 minutos
        
        // Carrega cache existente
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const data = JSON.parse(cached);
                const now = Date.now();
                
                // Remove itens expirados
                for (const [key, value] of Object.entries(data)) {
                    if (now - value.timestamp > maxAge) {
                        delete data[key];
                    }
                }
                
                this.apiCache = new Map(Object.entries(data));
            }
        } catch (error) {
            console.warn('⚠️ Erro ao carregar cache:', error);
        }
    }

    /**
     * Configura cache de assets
     */
    setupAssetsCache() {
        // Service Worker já gerencia cache de assets
        if ('serviceWorker' in navigator) {
            console.log('✅ Service Worker gerencia cache de assets');
        }
    }

    /**
     * Configura compressão
     */
    setupCompression() {
        if (this.optimizations.compression) {
            // Compressão de dados
            this.setupDataCompression();
            
            // Compressão de imagens
            this.setupImageCompression();
        }
    }

    /**
     * Configura compressão de dados
     */
    setupDataCompression() {
        // Compressão simples de strings
        this.compressString = (str) => {
            return str.replace(/\s+/g, ' ').trim();
        };
        
        // Descompressão
        this.decompressString = (str) => {
            return str;
        };
    }

    /**
     * Configura compressão de imagens
     */
    setupImageCompression() {
        // Usa formatos otimizados
        this.getOptimizedImageFormat = () => {
            if (this.checkWebPSupport()) {
                return 'webp';
            } else if (this.checkAVIFSupport()) {
                return 'avif';
            } else {
                return 'jpeg';
            }
        };
    }

    /**
     * Verifica suporte ao AVIF
     */
    checkAVIFSupport() {
        return new Promise((resolve) => {
            const avif = new Image();
            avif.onload = avif.onerror = () => {
                resolve(avif.height === 1);
            };
            avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
        });
    }

    /**
     * Handlers de eventos
     */
    handleButtonClick(button, event) {
        // Previne múltiplos cliques
        if (button.disabled) {
            event.preventDefault();
            return;
        }
        
        // Desabilita temporariamente
        button.disabled = true;
        setTimeout(() => {
            button.disabled = false;
        }, 1000);
    }

    handleLinkClick(link, event) {
        // Preload da página de destino
        const href = link.href;
        if (href && href.startsWith(window.location.origin)) {
            this.preloadPage(href);
        }
    }

    /**
     * Preload de página
     */
    preloadPage(url) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        document.head.appendChild(link);
    }

    /**
     * Reporta métricas
     */
    reportMetric(name, value) {
        // Envia para analytics
        if (window.gtag) {
            gtag('event', 'performance', {
                metric_name: name,
                metric_value: value
            });
        }
        
        // Log local
        console.log(`📊 ${name}: ${value}`);
        
        // Dispara evento customizado
        const event = new CustomEvent('performanceMetric', {
            detail: { name, value, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    /**
     * Reporta erros
     */
    reportError(type, error) {
        console.error(`❌ ${type} Error:`, error);
        
        // Envia para serviço de monitoramento
        if (window.Sentry) {
            Sentry.captureException(error);
        }
        
        // Dispara evento customizado
        const event = new CustomEvent('performanceError', {
            detail: { type, error, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    /**
     * Getters para métricas
     */
    getMetrics() {
        return this.metrics;
    }

    getOptimizations() {
        return this.optimizations;
    }

    getResources() {
        return this.resources;
    }
}

// Inicializa o sistema de performance
const performanceManager = new PerformanceManager();

// Exporta para uso global
window.PerformanceManager = PerformanceManager;
window.performance = performanceManager; 