# ⚡ Performance & Otimizações

## Objetivos

- ✅ Carregamento <2 segundos (First Contentful Paint)
- ✅ Lighthouse score >90 (Google)
- ✅ Core Web Vitals > 75% "Good"
- ✅ 90% mobile traffic

---

## 1. Otimização de Imagens

### Formato Correto
```
Logo, icones, gráficos       → SVG (sem limite de qualidade)
Fotos, heróis, screenshots   → WebP (melhor compressão)
Fallback (IE11)              → JPEG/PNG
```

### Tamanho Máximo por Imagem
```
Logo: 50kb
Hero: 150kb
Social proof: 100kb
Favicon: 20kb
```

### Ferramentas de Compressão
```bash
# WebP (melhor qualidade/tamanho)
cwebp image.jpg -q 75 -o image.webp

# TinyPNG online
https://tinypng.com (lossy + pngquant)

# ImageOptim (Mac)
https://imageoptim.com

# ImageMagick (CLI)
convert image.jpg -quality 75 image-optimized.jpg
```

### HTML Lazy Loading
```html
<!-- Imagens below-the-fold (lazy load) -->
<img src="placeholder.jpg" 
     data-src="real-image.jpg"
     loading="lazy"
     alt="Descrição">

<script>
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  }
</script>
```

---

## 2. Otimização de CSS

### Critical CSS (Above the Fold)
```html
<!-- Inline no <head> -->
<style>
  /* Apenas estilos visíveis no primeiro viewport */
  body { margin: 0; }
  .hero { background: #000; color: #fff; padding: 60px 20px; }
  .hero h1 { font-size: 32px; }
</style>

<!-- Defer CSS não-crítico -->
<link rel="preload" href="/css/global.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="/css/global.css"></noscript>
```

### Minificação CSS
```bash
# Usar netlify.toml
[build.environment]
  CSS_MINIFY = true
  JS_MINIFY = true
```

### Media Queries (Mobile-First)
```css
/* Base: mobile (320px+) */
body { font-size: 16px; }
.container { padding: 20px; }

/* Tablet (768px+) */
@media (min-width: 768px) {
  body { font-size: 18px; }
  .container { padding: 30px; max-width: 768px; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  body { font-size: 20px; }
  .container { max-width: 1024px; }
}
```

---

## 3. Otimização de JavaScript

### Defer & Async
```html
<!-- Crítico: bloqueante (antes de </body>) -->
<script src="/js/global.js"></script>

<!-- Não-crítico: async -->
<script async src="https://www.googletagmanager.com/gtag/js"></script>
<script async src="https://connect.facebook.net/fbevents.js"></script>

<!-- Não-crítico: defer -->
<script defer src="/js/analytics.js"></script>
<script defer src="/js/forms.js"></script>
```

### Tree-shaking (Remover código não-usado)
```javascript
// ❌ Evite funções não-utilizadas
function unusedFunction() { }
function anotherUnused() { }

// ✅ Apenas funções necessárias
function init() {
  setupForms();
  trackPageView();
}

document.addEventListener('DOMContentLoaded', init);
```

### Minificação JS
```bash
# Online: https://www.minifier.org/
# ou usar Netlify automático (netlify.toml)
```

### Código Splitting (Se usar build)
```javascript
// Importar apenas quando necessário
if (window.location.pathname === '/quiz/') {
  import('./quiz.js').then(module => {
    module.initQuiz();
  });
}
```

---

## 4. Otimização de Fontes

### Google Fonts (Pré-conectar)
```html
<!-- 1. Pré-conectar (DNS lookup) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- 2. Importar com weights específicos -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">

<!-- 3. Usar no CSS -->
<style>
  body { font-family: 'Inter', sans-serif; }
  .bold { font-weight: 700; }
</style>
```

### Fallback Fonts (Evitar layout shift)
```css
body {
  /* Usar fonte segura como fallback */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  /* font-display: swap = mostrar fallback enquanto carrega */
}
```

---

## 5. Caching Estratégico

### Netlify Cache (netlify.toml)
```toml
[build]
  # Cache de build
  command = "# sem build"
  publish = "/"

# Cache de headers
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000" # 1 ano

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=3600" # 1 hora

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

### Service Worker (Offline Support - Opcional)
```javascript
// js/service-worker.js
const CACHE_NAME = 'padraointerrompido-v1';
const URLS_TO_CACHE = [
  '/',
  '/css/global.css',
  '/js/global.js',
  '/assets/logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

---

## 6. Core Web Vitals

### LCP (Largest Contentful Paint) <2.5s
**O que medir:** Tempo até elemento principal aparecer

**Otimizações:**
```javascript
// Medir LCP
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.renderTime || entry.loadTime);
  }
});
observer.observe({entryTypes: ['largest-contentful-paint']});

// Minimizar JavaScript bloqueante
// Usar lazy loading para images
// Comprimir CSS/JS
```

### FID (First Input Delay) <100ms
**O que medir:** Tempo de resposta ao usuário clicar

**Otimizações:**
```javascript
// Usar requestIdleCallback para tarefas pesadas
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    // Tarefa pesada aqui (analytics, tracking)
    trackComplexMetrics();
  });
} else {
  // Fallback para setTimeout
  setTimeout(() => trackComplexMetrics(), 0);
}

// Quebrar scripts longos em chunks
const longTask = () => {
  // Processar em pedaços
  const chunks = [task1, task2, task3];
  chunks.forEach(chunk => {
    requestIdleCallback(() => chunk());
  });
};
```

### CLS (Cumulative Layout Shift) <0.1
**O que medir:** Quanto a página se move enquanto carrega

**Otimizações:**
```html
<!-- Reservar espaço para imagens (aspect-ratio) -->
<img src="hero.jpg" width="1200" height="600" alt="Hero">

<!-- ou CSS -->
<style>
  img {
    aspect-ratio: 16/9;
    width: 100%;
  }
</style>

<!-- Fonte: usar font-display: swap -->
<style>
  @font-face {
    font-family: 'Inter';
    font-display: swap; /* Não bloqueia rendering *)
  }
</style>
```

---

## 7. Testing & Monitoring

### Google Lighthouse
```bash
# Automático em Chrome DevTools
1. F12 → Lighthouse
2. Select "Mobile" ou "Desktop"
3. Run audit
4. Alvo: >90 score
```

### Google PageSpeed Insights
```
https://pagespeed.web.dev/
1. Cole URL
2. Analisa mobile + desktop
3. Dá recomendações específicas
```

### Ferramentas de Monitoramento
```
WebPageTest: https://www.webpagetest.org/
GTmetrix: https://gtmetrix.com/
Pingdom: https://tools.pingdom.com/
```

### Monitorar Continuamente
```javascript
// Enviar métricas para analytics
function reportWebVitals() {
  // LCP
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach(entry => {
      gtag('event', 'web_vital', {
        metric_id: 'LCP',
        metric_value: entry.renderTime || entry.loadTime,
      });
    });
  }).observe({entryTypes: ['largest-contentful-paint']});
  
  // FID
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach(entry => {
      gtag('event', 'web_vital', {
        metric_id: 'FID',
        metric_value: entry.processingDuration,
      });
    });
  }).observe({entryTypes: ['first-input']});
  
  // CLS
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach(entry => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        gtag('event', 'web_vital', {
          metric_id: 'CLS',
          metric_value: clsValue,
        });
      }
    });
  }).observe({entryTypes: ['layout-shift']});
}

reportWebVitals();
```

---

## 8. Checklist de Performance

- [ ] Imagens <200kb (hero)
- [ ] Imagens com aspect-ratio definido
- [ ] CSS crítico inlinado
- [ ] JS defer/async (não bloqueante)
- [ ] Google Fonts pré-conectado
- [ ] Cache headers configurado
- [ ] Gzip ativado (Netlify automático)
- [ ] Lighthouse >90 (mobile + desktop)
- [ ] LCP <2.5s
- [ ] FID <100ms
- [ ] CLS <0.1
- [ ] No render-blocking resources
- [ ] No unused CSS/JS
- [ ] Mobile-first responsivo
- [ ] Teste em conexão 3G (DevTools throttling)

---

## Recursos

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Netlify Performance Guide](https://docs.netlify.com/platform/security/deploy-key-rotation/)
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)

---

**Última atualização:** Maio 2026  
**Próximo review:** Junho 2026
