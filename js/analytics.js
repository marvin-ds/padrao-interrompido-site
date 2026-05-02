/* ============================================
   PADRÃO INTERROMPIDO™ - ANALYTICS
   ============================================ */

// Google Analytics 4
// Substitua G-XXXXXXXXXX pelo seu ID de propriedade GA4
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
// gtag('config', 'G-XXXXXXXXXX');

// Meta Pixel
// Substitua 123456789 pelo seu Pixel ID
/*
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '123456789');
fbq('track', 'PageView');
*/

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

console.log('✓ Analytics carregado');
