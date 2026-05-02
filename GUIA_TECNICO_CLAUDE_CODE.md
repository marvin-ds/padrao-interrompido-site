# GUIA TÉCNICO — CLAUDE CODE
## Implementação de Páginas PADRÃO INTERROMPIDO™

**Documento:** Instruções técnicas para Claude Code gerar HTML/CSS/JS  
**Versão:** 1.0  
**Data:** Maio 2026  
**Público:** Marcos Vinicius + Desenvolvimento via Claude Code

---

## I. ANTES DE COMEÇAR

### Dependências Externas (CDN)
```html
<!-- Incluir em TODAS as páginas no <head> -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="[Descrição da página]">
<meta name="robots" content="index, follow">

<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>

<!-- Meta Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  ...
</script>

<!-- Netlify Forms -->
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

### Estrutura HTML Base (Template)
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[TÍTULO PÁGINA]</title>
  <link rel="stylesheet" href="/css/global.css">
  <link rel="stylesheet" href="/css/pages.css">
</head>
<body>
  <!-- Header/Nav (reutilizável) -->
  <header class="navbar">
    <div class="navbar-container">
      <a href="/" class="logo">PADRÃO INTERROMPIDO™</a>
      <nav class="nav-links">
        <a href="/">Home</a>
        <a href="/quiz/">Quiz</a>
        <a href="/ebook/">Ebook</a>
      </nav>
    </div>
  </header>

  <!-- Conteúdo Principal -->
  <main>
    [CONTEÚDO ESPECÍFICO DA PÁGINA]
  </main>

  <!-- Footer (reutilizável) -->
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>Sobre</h4>
        <ul>
          <li><a href="/politica-de-privacidade/">Política de Privacidade</a></li>
          <li><a href="/termos-de-uso/">Termos de Uso</a></li>
        </ul>
      </div>
      <div class="footer-section">
        <h4>Contato</h4>
        <p>contato@padraointerrompido.com.br</p>
        <a href="https://wa.me/55..." class="whatsapp-link">WhatsApp</a>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="/js/global.js"></script>
  <script src="/js/analytics.js"></script>
  <script src="/js/forms.js"></script>
</body>
</html>
```

---

## II. PADRÕES DE CÓDIGO

### CSS — Nomeclatura
```css
/* Padrão: BEM (Block Element Modifier) */

/* Block: componente independente */
.button { }
.card { }
.hero { }

/* Element: parte de um bloco */
.button__text { }
.card__title { }
.hero__image { }

/* Modifier: variação */
.button--primary { }
.button--secondary { }
.card--featured { }

/* Exemplo real: */
.hero {
  background: linear-gradient(135deg, #000 0%, #1B4D5C 100%);
  padding: 60px 20px;
  text-align: center;
}

.hero__title {
  font-size: 32px;
  font-weight: 700;
  color: #FFFFFF;
  margin-bottom: 20px;
}

.hero__subtitle {
  font-size: 18px;
  font-weight: 400;
  color: #D0D0D0;
}
```

### Responsividade
```css
/* Mobile-first approach */

/* Mobile (base) */
.container {
  width: 100%;
  padding: 20px;
  font-size: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    max-width: 768px;
    padding: 30px;
    font-size: 18px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding: 40px;
    font-size: 20px;
  }
}
```

### JavaScript — Estrutura
```javascript
// 1. Seletores (no topo)
const formElement = document.getElementById('contact-form');
const emailInput = document.querySelector('input[name="email"]');
const submitBtn = document.querySelector('button[type="submit"]');

// 2. Função de inicialização
function init() {
  if (formElement) {
    formElement.addEventListener('submit', handleFormSubmit);
  }
  trackPageView();
}

// 3. Event handlers
function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateForm()) {
    showError('Por favor, preencha todos os campos');
    return;
  }
  
  submitToZapier();
}

// 4. Validação
function validateForm() {
  const email = emailInput.value.trim();
  return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

// 5. Integração (Zapier/Analytics)
function submitToZapier() {
  const data = new FormData(formElement);
  
  fetch('ZAPIER_WEBHOOK_URL', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(data))
  })
  .then(res => {
    if (res.ok) {
      trackConversion('form_submit');
      showSuccess('Email capturado com sucesso!');
    }
  })
  .catch(err => console.error(err));
}

// 6. Analytics
function trackPageView() {
  if (window.gtag) {
    gtag('event', 'page_view', {
      page_title: document.title,
      page_path: window.location.pathname
    });
  }
}

// 7. Rodas de inicialização
document.addEventListener('DOMContentLoaded', init);
```

---

## III. PÁGINAS — ESPECIFICAÇÕES TÉCNICAS

### HOME (/index.html)

**Seções:**
1. Hero (gancho brutal)
2. Pain Points (3 situações)
3. Mecanismo Explicado
4. Prova Social (2-3 cases)
5. FAQ (5 perguntas)
6. CTA Final (Quiz)

**Elementos Obrigatórios:**
- Meta description: <160 caracteres
- H1 único (gancho principal)
- Imagem hero otimizada (<200kb)
- 3+ h2 para estrutura
- Links internos para /quiz/, /ebook/, /sessao/
- Form ou Link para quiz

**Analytics Events:**
- `page_view` (automático)
- `scroll_depth` (50%, 75%, 100%)
- `click_quiz_cta` (ao clicar botão Quiz)
- `click_external_link` (links externos)

---

### QUIZ (/quiz/index.html)

**Seções:**
1. Landing (vender o quiz)
2. Barra de progresso dinâmica
3. Perguntas (15 dinâmicas)
4. Tela de processamento
5. Resultado (perfil)
6. Captura email
7. Confirmação

**Estrutura de Dados (JS):**
```javascript
const perguntas = [
  {
    id: 1,
    texto: "Quando você chega em casa cansada...",
    categoria: "comportamental",
    tipo: "multipla", // ou "likert"
    opcoes: [
      { label: "Opção A", valor: 2 },
      { label: "Opção B", valor: 3 },
      { label: "Opção C", valor: 1 },
      { label: "Opção D", valor: 4 }
    ]
  }
  // ... mais 14 perguntas
];

const perfis = [
  {
    id: 1,
    nome: "A Executora Invisível",
    territorio: "alimentar",
    velocidade: "rápido",
    descricao: "Você age antes de perceber...",
    produtoRecomendado: "Sessão R$250"
  }
  // ... 15 perfis restantes
];
```

**Integração Obrigatória:**
- Eduzz (pagamento R$17)
- Resend (envio PDF)
- Brevo (captura email)

**Analytics Events:**
- `quiz_started`
- `quiz_question_answered` (cada pergunta)
- `quiz_completed`
- `payment_initiated`
- `payment_success` / `payment_failed`
- `email_submitted`

---

### EBOOK (/ebook/index.html)

**Seções:**
1. Hero (valor do ebook)
2. O que você aprenderá (3-4 pontos)
3. Quem é o autor
4. 1 case/prova
5. Formulário (email obrigatório)
6. PDF download link

**Formulário:**
```html
<form name="ebook-capture" method="POST" netlify>
  <input 
    type="email" 
    name="email" 
    placeholder="seu@email.com" 
    required
  >
  <input 
    type="text" 
    name="nome" 
    placeholder="Seu nome (opcional)"
  >
  <label>
    <input type="checkbox" name="opt_in" checked>
    Aceito receber emails
  </label>
  <button type="submit">Receber Ebook</button>
</form>
```

**Integração:**
- Netlify Forms (captura)
- Zapier (webhook)
- Brevo (email)
- Resend (PDF)

---

### SESSÃO (/sessao/index.html)

**Seções:**
1. Hero (urgência)
2. Timeline 90 minutos
3. Resultados esperados
4. Social proof (vídeos/depoimentos)
5. FAQ (5 objeções)
6. CTA WhatsApp com script

**Script WhatsApp Pré-preenchido:**
```javascript
const whatsappNumber = "5511999999999"; // Seu número
const whatsappMessage = encodeURIComponent(
  "Olá! Gostaria de agendar uma sessão. Qual sua disponibilidade?"
);
const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
```

**Analytics:**
- `session_page_view`
- `click_whatsapp_cta`
- `form_submitted` (se houver form)

---

### PACOTE (/pacote/index.html)

**Seções:**
1. Hero (diferencial)
2. Tabela comparativa (Avulso vs Pacote)
3. Timeline 21 dias
4. Garantia (se houver)
5. Depoimentos
6. CTA Eduzz

**Tabela Comparativa:**
```html
<table class="comparison-table">
  <thead>
    <tr>
      <th>Sessão Avulsa</th>
      <th>Pacote 3 Sessões</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>R$250/sessão</td>
      <td>R$650 total (economize R$100)</td>
    </tr>
    <tr>
      <td>Sem acompanhamento</td>
      <td>21 dias de suporte</td>
    </tr>
    <!-- mais linhas -->
  </tbody>
</table>
```

---

## IV. INTEGRAÇÕES DETALHADAS

### Zapier (Automação Forms → Brevo)

**Setup:**
1. Criar Zap em zapier.com
2. Trigger: "Webhook Caught" (para Netlify Forms)
3. Action: "Create Contact" em Brevo
4. Mapear campos:
   - email (required)
   - nome (optional)
   - origem: "landing_ebook" (ou outra)
   - tags: ["novo_lead", "ebook"]

**Webhook URL** (copiar em Netlify):
```
https://hooks.zapier.com/hooks/catch/[SEU_ID]/[SEU_HOOK]/
```

---

### Resend (Email Transacional)

**Uso:**
- Envio de ebook PDF após captura
- Confirmação de quiz
- Confirmação de pagamento

**API Call (JS):**
```javascript
async function enviarEmailResend(email, pdfUrl) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'noreply@padraointerrompido.com.br',
      to: email,
      subject: 'Seu Ebook PADRÃO INTERROMPIDO™',
      html: `<h1>Receba seu ebook!</h1><a href="${pdfUrl}">Download</a>`
    })
  });
  return response.json();
}
```

---

### Brevo (Email Marketing)

**Sequências Automáticas:**

1. **Welcome (imediato)**
   - Agradecimento
   - Link para quiz

2. **Dia 3**
   - Prova social
   - Case específico

3. **Dia 7**
   - Educação
   - CTA para outra página

4. **Dia 14**
   - Reativação
   - Último CTA

---

### Google Analytics 4

**Eventos Principais a Rastrear:**

```javascript
// 1. Scroll depth
gtag('event', 'scroll', {
  percent_scrolled: 50,
  page_path: window.location.pathname
});

// 2. CTA clicks
gtag('event', 'click', {
  element_id: 'quiz-button',
  element_text: 'Fazer Quiz',
  page_path: window.location.pathname
});

// 3. Form submission
gtag('event', 'form_submit', {
  form_id: 'ebook-form',
  form_destination: '/ebook/',
  page_path: window.location.pathname
});

// 4. Conversão (após pagamento)
gtag('event', 'purchase', {
  value: 17.00,
  currency: 'BRL',
  items: [{ item_name: 'Quiz Diagnóstico' }]
});
```

---

## V. OTIMIZAÇÕES OBRIGATÓRIAS

### Performance
- [ ] Imagens otimizadas (<200kb)
- [ ] CSS minificado
- [ ] JS assíncrono (async/defer)
- [ ] Lazy loading para imagens
- [ ] Gzip ativado no Netlify
- [ ] Lighthouse score >90

### SEO
- [ ] Meta descriptions (<160 chars)
- [ ] H1 único por página
- [ ] H2/H3 hierarquizados
- [ ] Alt text em todas as imagens
- [ ] URLs amigáveis (lowercase, hífens)
- [ ] Mobile-responsive
- [ ] Sitemap.xml
- [ ] robots.txt

### Conversão
- [ ] CTAs acima da fold
- [ ] Cores contrastantes (azul petróleo em branco)
- [ ] Botões >44px (mobile tap target)
- [ ] Formulários <5 campos (mobile)
- [ ] Trust signals (LGPD, logo, depoimentos)
- [ ] Social proof visível

---

## VI. TESTING CHECKLIST

### Antes de Fazer Push

- [ ] Testar em Chrome, Firefox, Safari
- [ ] Testar responsivo: 320px, 768px, 1024px
- [ ] Testar formulários (envio real)
- [ ] Testar links (nenhum quebrado)
- [ ] Testar Analytics (eventos disparando)
- [ ] Testar integração Zapier (webhook)
- [ ] Validar LGPD (checkbox, link policy)
- [ ] Validar velocidade (< 2s)

---

## VII. FLUXO DE DESENVOLVIMENTO

### Passo 1: Estrutura Base
```bash
git clone https://github.com/seu-usuario/padraointerrompido.git
cd padraointerrompido
```

### Passo 2: Criar Página
1. Crie pasta: `mkdir nova-pagina`
2. Crie arquivo: `touch nova-pagina/index.html`
3. Use template base
4. Customize conteúdo
5. Teste localmente
6. Commit: `git add . && git commit -m "descrição"`
7. Push: `git push origin main`

### Passo 3: Deploy
Netlify detecta push → deploy automático em 30s

---

## VIII. REFERÊNCIA RÁPIDA

### Cores
- Preto: #000000
- Branco: #FFFFFF
- Azul (CTA): #1B4D5C
- Cinza: #666666

### Espaçamento (múltiplos de 8px)
- xs: 8px
- sm: 16px
- md: 24px
- lg: 32px
- xl: 48px

### Fonts
```css
font-family: 'Inter', -apple-system, sans-serif;
font-weight: 400 (regular), 500 (medium), 600 (semibold), 700 (bold);
```

---

**Versão:** 1.0  
**Próxima atualização:** Após Fase 1  
**Pronto para usar com Claude Code**
