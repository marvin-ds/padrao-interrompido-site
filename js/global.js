/* ============================================
   PADRÃO INTERROMPIDO™ - SCRIPTS GLOBAIS
   ============================================ */

// Função para abrir/fechar FAQ
function toggleFaq(trigger) {
  const content = trigger.nextElementSibling;
  const isActive = trigger.classList.contains('active');

  // Fechar todos os outros
  document.querySelectorAll('.faq-trigger.active').forEach(item => {
    if (item !== trigger) {
      item.classList.remove('active');
      item.nextElementSibling.classList.remove('active');
    }
  });

  // Toggle o atual
  trigger.classList.toggle('active');
  content.classList.toggle('active');
}

// Função para scroll suave para âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Função para rastrear scroll depth
let scrollTracked = false;
window.addEventListener('scroll', () => {
  if (!scrollTracked) {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    if (scrollPercent > 25) {
      trackEvent('scroll_depth', { depth: '25%' });
      scrollTracked = true;
    }
  }
});

// Função auxiliar para rastrear eventos (placeholder para GA4)
function trackEvent(eventName, eventData = {}) {
  if (window.gtag) {
    gtag('event', eventName, eventData);
  }
}

// Inicializar ao carregar
document.addEventListener('DOMContentLoaded', () => {
  console.log('✓ Scripts globais carregados');
});
