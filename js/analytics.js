/* ============================================
   PADRÃO INTERROMPIDO™ - ANALYTICS
   ============================================ */

// GA4 e Meta Pixel são inicializados pelo GTM no <head> de cada página.
// Este arquivo só registra eventos de comportamento (cliques, formulários).

// Rastrear cliques em CTAs principais
document.querySelectorAll('.cta-primary, .cta-secondary').forEach(button => {
  button.addEventListener('click', function() {
    const buttonText = this.textContent.trim();
    const pageSection = this.closest('section')?.id || 'unknown';

    if (window.gtag) {
      gtag('event', 'button_click', {
        button_text: buttonText,
        page_section: pageSection,
        page_path: window.location.pathname
      });
    }
  });
});

// Rastrear submissão de formulários (quando existirem)
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    const formId = this.id || this.name || 'form-unknown';

    if (window.gtag) {
      gtag('event', 'form_submit', {
        form_id: formId,
        page_path: window.location.pathname
      });
    }
  });
});

// Rastrear page view
if (window.gtag) {
  gtag('event', 'page_view', {
    page_title: document.title,
    page_path: window.location.pathname
  });
}

