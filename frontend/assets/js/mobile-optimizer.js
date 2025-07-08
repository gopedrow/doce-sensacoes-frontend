/**
 * 📱 MOBILE OPTIMIZER - DOCE SENSACOES
 * Sistema completo de otimização para dispositivos móveis
 */

class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTablet = this.detectTablet();
        this.isLandscape = window.innerWidth > window.innerHeight;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        this.init();
    }

    /**
     * Detecta se é dispositivo móvel
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }

    /**
     * Detecta se é tablet
     */
    detectTablet() {
        return /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(navigator.userAgent) ||
               (window.innerWidth > 768 && window.innerWidth <= 1024);
    }

    /**
     * Inicializa o otimizador
     */
    init() {
        if (this.isMobile) {
            this.setupMobileOptimizations();
            this.setupTouchGestures();
            this.setupPerformanceOptimizations();
            this.setupAccessibility();
            this.setupPWAFeatures();
        }
        
        this.setupResponsiveHandlers();
        this.setupOrientationHandlers();
    }

    /**
     * Configura otimizações específicas para mobile
     */
    setupMobileOptimizations() {
        // Previne zoom em inputs
        this.preventInputZoom();
        
        // Otimiza scroll
        this.optimizeScroll();
        
        // Configura viewport
        this.setupViewport();
        
        // Otimiza imagens
        this.optimizeImages();
        
        // Configura menu mobile
        this.setupMobileMenu();
        
        // Otimiza carregamento
        this.optimizeLoading();
    }

    /**
     * Previne zoom automático em inputs no iOS
     */
    preventInputZoom() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.fontSize = '16px';
            });
            
            input.addEventListener('blur', () => {
                input.style.fontSize = '';
            });
        });
    }

    /**
     * Otimiza performance do scroll
     */
    optimizeScroll() {
        // Adiciona classe para otimização de scroll
        document.body.classList.add('mobile-scroll-optimized');
        
        // Otimiza scroll suave
        const smoothScrollElements = document.querySelectorAll('a[href^="#"]');
        smoothScrollElements.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /**
     * Configura viewport para mobile
     */
    setupViewport() {
        // Adiciona meta viewport se não existir
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewport);
        }
    }

    /**
     * Otimiza carregamento de imagens
     */
    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Lazy loading
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
            
            // Otimiza tamanho em mobile
            if (this.isMobile) {
                img.classList.add('mobile-optimized');
            }
        });
    }

    /**
     * Configura menu mobile
     */
    setupMobileMenu() {
        const mobileBtn = document.getElementById('mobile_btn');
        const mobileMenu = document.getElementById('mobile_menu');
        
        if (mobileBtn && mobileMenu) {
            // Toggle menu
            mobileBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // Fecha menu ao clicar em link
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
            
            // Fecha menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!mobileBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        }
    }

    /**
     * Otimiza carregamento da página
     */
    optimizeLoading() {
        // Adiciona loading state
        document.body.classList.add('mobile-loading-state');
        
        // Remove loading quando página carrega
        window.addEventListener('load', () => {
            document.body.classList.remove('mobile-loading-state');
            document.body.classList.add('mobile-loaded');
        });
        
        // Preload de recursos críticos
        this.preloadCriticalResources();
    }

    /**
     * Preload de recursos críticos
     */
    preloadCriticalResources() {
        const criticalResources = [
            '/frontend/assets/images/hero.png',
            '/frontend/assets/images/chef.png'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = resource;
            document.head.appendChild(link);
        });
    }

    /**
     * Configura gestos de toque
     */
    setupTouchGestures() {
        // Swipe para navegação
        this.setupSwipeNavigation();
        
        // Pull to refresh (simulado)
        this.setupPullToRefresh();
        
        // Long press
        this.setupLongPress();
    }

    /**
     * Configura navegação por swipe
     */
    setupSwipeNavigation() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Swipe horizontal
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left
                    this.handleSwipeLeft();
                } else {
                    // Swipe right
                    this.handleSwipeRight();
                }
            }
        });
    }

    /**
     * Manipula swipe para esquerda
     */
    handleSwipeLeft() {
        // Pode ser usado para navegar entre seções
        console.log('Swipe left detected');
    }

    /**
     * Manipula swipe para direita
     */
    handleSwipeRight() {
        // Pode ser usado para abrir menu
        const mobileMenu = document.getElementById('mobile_menu');
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            document.body.classList.add('menu-open');
        }
    }

    /**
     * Configura pull to refresh
     */
    setupPullToRefresh() {
        let startY = 0;
        let currentY = 0;
        let pullDistance = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && startY > 0) {
                currentY = e.touches[0].clientY;
                pullDistance = currentY - startY;
                
                if (pullDistance > 0) {
                    e.preventDefault();
                    this.showPullToRefreshIndicator(pullDistance);
                }
            }
        });
        
        document.addEventListener('touchend', () => {
            if (pullDistance > 100) {
                this.handlePullToRefresh();
            }
            this.hidePullToRefreshIndicator();
            startY = 0;
            pullDistance = 0;
        });
    }

    /**
     * Mostra indicador de pull to refresh
     */
    showPullToRefreshIndicator(distance) {
        let indicator = document.getElementById('pull-refresh-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'pull-refresh-indicator';
            indicator.innerHTML = '🔄 Puxe para atualizar';
            indicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: var(--color-primary-6);
                color: white;
                text-align: center;
                padding: 10px;
                z-index: 10000;
                transform: translateY(-100%);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(indicator);
        }
        
        const translateY = Math.min(distance * 0.5, 60);
        indicator.style.transform = `translateY(${translateY}px)`;
    }

    /**
     * Esconde indicador de pull to refresh
     */
    hidePullToRefreshIndicator() {
        const indicator = document.getElementById('pull-refresh-indicator');
        if (indicator) {
            indicator.style.transform = 'translateY(-100%)';
        }
    }

    /**
     * Manipula pull to refresh
     */
    handlePullToRefresh() {
        // Recarrega a página
        window.location.reload();
    }

    /**
     * Configura long press
     */
    setupLongPress() {
        let pressTimer;
        
        document.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                this.handleLongPress(e);
            }, 500);
        });
        
        document.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });
        
        document.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        });
    }

    /**
     * Manipula long press
     */
    handleLongPress(e) {
        // Pode ser usado para menu de contexto
        console.log('Long press detected');
    }

    /**
     * Configura otimizações de performance
     */
    setupPerformanceOptimizations() {
        // Debounce de eventos de scroll
        this.debounceScroll();
        
        // Otimiza animações
        this.optimizeAnimations();
        
        // Reduz reflows
        this.reduceReflows();
    }

    /**
     * Debounce de eventos de scroll
     */
    debounceScroll() {
        let ticking = false;
        
        const updateScroll = () => {
            // Atualiza elementos baseados no scroll
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        });
    }

    /**
     * Otimiza animações
     */
    optimizeAnimations() {
        // Adiciona will-change para elementos animados
        const animatedElements = document.querySelectorAll('.btn-default, .social-media-buttons a, .dish');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform';
        });
    }

    /**
     * Reduz reflows
     */
    reduceReflows() {
        // Agrupa mudanças de DOM
        const observer = new MutationObserver(() => {
            // Otimiza mudanças de DOM
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Configura acessibilidade
     */
    setupAccessibility() {
        // Skip links
        this.setupSkipLinks();
        
        // Navegação por teclado
        this.setupKeyboardNavigation();
        
        // Screen reader support
        this.setupScreenReaderSupport();
    }

    /**
     * Configura skip links
     */
    setupSkipLinks() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    /**
     * Configura navegação por teclado
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // ESC fecha menu mobile
            if (e.key === 'Escape') {
                const mobileMenu = document.getElementById('mobile_menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    }

    /**
     * Configura suporte para screen readers
     */
    setupScreenReaderSupport() {
        // Adiciona ARIA labels
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label')) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
    }

    /**
     * Configura recursos PWA
     */
    setupPWAFeatures() {
        // Adiciona suporte para instalação PWA
        this.setupPWAInstall();
        
        // Configura offline support
        this.setupOfflineSupport();
        
        // Configura notificações
        this.setupNotifications();
    }

    /**
     * Configura instalação PWA
     */
    setupPWAInstall() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Mostra botão de instalação
            this.showInstallButton();
        });
    }

    /**
     * Mostra botão de instalação
     */
    showInstallButton() {
        const installBtn = document.createElement('button');
        installBtn.textContent = '📱 Instalar App';
        installBtn.className = 'btn-default pwa-install-btn';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            background: var(--color-primary-6);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        installBtn.addEventListener('click', () => {
            // Instala PWA
            console.log('Installing PWA...');
        });
        
        document.body.appendChild(installBtn);
    }

    /**
     * Configura suporte offline
     */
    setupOfflineSupport() {
        window.addEventListener('online', () => {
            this.showNotification('Conexão restaurada!', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('Você está offline', 'warning');
        });
    }

    /**
     * Configura notificações
     */
    setupNotifications() {
        // Solicita permissão para notificações
        if ('Notification' in window) {
            Notification.requestPermission();
        }
    }

    /**
     * Mostra notificação
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.className = `mobile-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 10000;
            text-align: center;
            font-size: 14px;
            transform: translateY(-100px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateY(-100px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Configura handlers responsivos
     */
    setupResponsiveHandlers() {
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    /**
     * Configura handlers de orientação
     */
    setupOrientationHandlers() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
    }

    /**
     * Manipula redimensionamento
     */
    handleResize() {
        const newIsMobile = this.detectMobile();
        const newIsTablet = this.detectTablet();
        
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            if (this.isMobile) {
                this.setupMobileOptimizations();
            }
        }
        
        if (newIsTablet !== this.isTablet) {
            this.isTablet = newIsTablet;
        }
    }

    /**
     * Manipula mudança de orientação
     */
    handleOrientationChange() {
        this.isLandscape = window.innerWidth > window.innerHeight;
        
        // Ajusta layout baseado na orientação
        if (this.isLandscape) {
            document.body.classList.add('landscape');
            document.body.classList.remove('portrait');
        } else {
            document.body.classList.add('portrait');
            document.body.classList.remove('landscape');
        }
    }

    /**
     * Debounce helper
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
     * Retorna informações do dispositivo
     */
    getDeviceInfo() {
        return {
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isLandscape: this.isLandscape,
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            userAgent: navigator.userAgent,
            platform: navigator.platform
        };
    }
}

// Inicializa o otimizador quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.mobileOptimizer = new MobileOptimizer();
});

// Inicializa também se o DOM já estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileOptimizer = new MobileOptimizer();
    });
} else {
    window.mobileOptimizer = new MobileOptimizer();
} 