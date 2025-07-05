// Função para inicializar as animações do ScrollReveal
function initScrollReveal() {
  if (typeof ScrollReveal !== 'undefined') {
    // Animação para textos do lado esquerdo
    ScrollReveal().reveal('.left', {
      origin: 'left',
      distance: '60px',
      duration: 1200,
      delay: 200,
      opacity: 0,
      easing: 'ease',
      reset: false
    });
    
    // Animação para o formulário do lado direito
    ScrollReveal().reveal('.right', {
      origin: 'right',
      distance: '60px',
      duration: 1200,
      delay: 400,
      opacity: 0,
      easing: 'ease',
      reset: false
    });
  }
}

// Função para lidar com o envio do formulário de login
function handleLoginSubmit(event) {
  event.preventDefault();
  window.location.href = 'perfil.html';
}

// Função para lidar com a transição para cadastro
function handleCadastroTransition(e) {
  e.preventDefault();
  const leftElement = document.querySelector('.left');
  const rightElement = document.querySelector('.right');
  
  if (leftElement && rightElement) {
    leftElement.classList.add('expand');
    rightElement.classList.add('shrink');
    
    setTimeout(function() {
      window.location.href = 'cadastro.html';
    }, 700);
  }
}

// Função para inicializar todos os event listeners
function initEventListeners() {
  const loginForm = document.getElementById('loginForm');
  const cadastroLink = document.getElementById('goToCadastro');
  
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
  
  if (cadastroLink) {
    cadastroLink.addEventListener('click', handleCadastroTransition);
  }
}

// Função principal que inicializa tudo quando o DOM estiver carregado
function init() {
  initEventListeners();
  
  // Aguarda o ScrollReveal carregar antes de inicializar as animações
  if (typeof ScrollReveal !== 'undefined') {
    initScrollReveal();
  } else {
    // Se o ScrollReveal ainda não carregou, tenta novamente após um delay
    setTimeout(initScrollReveal, 100);
  }
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 