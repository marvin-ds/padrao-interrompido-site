# 🔗 Integrações — Guia Técnico

## Visão Geral do Fluxo

```
Visitante
  ↓
Landing Page (Home/Ebook)
  ↓ (Netlify Forms)
Brevo (CRM de email)
  ↓ (Zapier webhook)
Welcome automático
  ↓ (14 dias de nutrição)
Quiz Page
  ↓ (Eduzz gateway)
Pagamento Processado
  ↓ (Resend API)
PDF + Confirmação
  ↓ (Brevo segmentação)
Página de Produto
  ↓ (Conversão final)
Marcos (atendimento)
```

---

## 1. Netlify Forms (Captura de Email)

### Setup HTML
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
    placeholder="Seu nome"
  >
  <label>
    <input type="checkbox" name="opt_in" checked>
    Aceito receber emails (LGPD)
  </label>
  <button type="submit">Receber Ebook</button>
</form>
```

### Como Funciona
1. Usuário preenche formulário
2. Netlify intercepta submissão
3. Dados salvos em Netlify dashboard
4. Webhook dispara para Zapier
5. Zapier envia para Brevo

### Configurar Webhook (Netlify → Zapier)
1. **Netlify:** Site settings → Build & deploy → Post processing
2. **Add notification → Zapier**
3. Copie webhook URL gerada
4. Configure em Zapier (veja seção Zapier)

---

## 2. Zapier (Automação Form → Brevo)

### Criar Zap
1. Vá para [zapier.com](https://zapier.com)
2. **Trigger:** "Netlify Forms" → Select trigger event "Form Submission"
3. **Action:** "Create Contact" em Brevo

### Mapear Campos
```javascript
Netlify Field → Brevo Field
email → email (required)
nome → first_name (optional)
opt_in → consent (boolean)
```

### Webhook URL Resultante
```
https://hooks.zapier.com/hooks/catch/YOUR_USER_ID/YOUR_HOOK_ID/
```

### Test Zap
1. Envie formulário de teste no site
2. Zapier deve registrar submissão
3. Contact deve aparecer em Brevo dentro de 60s

---

## 3. Brevo (Email Marketing + CRM)

### Setup Conta
1. [brevo.com](https://brevo.com) → Sign up (grátis)
2. Verify domínio (padraointerrompido.com.br)
3. Criar lista "Leads PADRÃO INTERROMPIDO™"

### Sequências Automáticas
Após captura via Zapier, enviar:

**Email 1 — Welcome (imediato)**
```
Subject: Bem-vindo(a) ao PADRÃO INTERROMPIDO™
Body: Agradecimento + link para Quiz
CTA: "Fazer Quiz Diagnóstico" → /quiz/
```

**Email 2 — Dia 3 (Prova Social)**
```
Subject: 3 casos de transformação
Body: Cases de clientes
CTA: "Ver mais detalhes" → /sessao/
```

**Email 3 — Dia 7 (Educação)**
```
Subject: Entenda seu padrão
Body: Explicação da mecânica
CTA: "Explorar workbook" → /workbook/
```

**Email 4 — Dia 14 (Reativação)**
```
Subject: Última chance de desconto
Body: Oferta limitada
CTA: "Aproveitar oferta" → /pacote/
```

### Segmentação por Quiz (Opcional)
- Tag por perfil após quiz completado
- Enviar emails específicos por território
- Aumenta relevância (ex: ebook + sessão específica)

---

## 4. Eduzz (Pagamento)

### Produtos Configurados
| Produto | Preço | Status |
|---------|-------|--------|
| Quiz Diagnóstico | R$17 | ✅ Live |
| Workbook | R$27 | ✅ Live |
| Áudio | R$47 | ✅ Live |
| Sessão | R$250 | ✅ Live |
| Pacote 3x | R$650 | ✅ Live |

### Integração HTML
```html
<!-- Botão de pagamento Eduzz -->
<a href="https://eduzz.com/produto/ID_PRODUTO" class="button button--primary">
  Comprar Produto (R$17)
</a>
```

### Rastreamento de Pagamento
```javascript
// Adicionar ao script de confirmação
function trackPaymentSuccess(productId, amount) {
  gtag('event', 'purchase', {
    value: amount,
    currency: 'BRL',
    items: [{
      item_id: productId,
      item_name: 'PADRÃO INTERROMPIDO™ Product'
    }]
  });
}
```

---

## 5. Resend (Email Transacional)

### Setup API Key
1. [resend.com](https://resend.com) → Sign up
2. API Keys → Criar nova chave
3. Adicionar em `.env.local`: `RESEND_API_KEY=re_xxxxx`

### Enviar Email (Node.js/Backend)
```javascript
async function enviarEmailResend(email, pdfUrl) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'noreply@padraointerrompido.com.br',
      to: email,
      subject: 'Seu Diagnóstico - PADRÃO INTERROMPIDO™',
      html: `
        <h1>Seu Diagnóstico Chegou!</h1>
        <p>Acesse seu PDF exclusivo abaixo:</p>
        <a href="${pdfUrl}" class="button">Baixar Diagnóstico</a>
        <p>Qualquer dúvida, responda este email!</p>
      `
    })
  });
  return response.json();
}
```

### Confirmação de Quiz
- Após pagamento Eduzz → Gerar PDF diagnóstico
- Enviar via Resend para email do cliente
- Link download válido por 7 dias (por segurança)

---

## 6. Google Analytics 4 (GA4)

### Instalação
```html
<!-- No <head> de TODAS as páginas -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Eventos a Rastrear
```javascript
// Page view (automático)
gtag('event', 'page_view');

// CTA clicks
gtag('event', 'click', {
  element_id: 'quiz-button',
  element_text: 'Fazer Quiz',
  page_path: '/home/'
});

// Form submission
gtag('event', 'form_submit', {
  form_id: 'ebook-form',
  page_path: '/ebook/'
});

// Conversão (pagamento)
gtag('event', 'purchase', {
  value: 17.00,
  currency: 'BRL',
  items: [{
    item_id: 'quiz-001',
    item_name: 'Quiz Diagnóstico'
  }]
});

// Scroll depth
gtag('event', 'scroll', {
  percent_scrolled: 50,
  page_path: window.location.pathname
});
```

### Dashboard Key Metrics
- Sessões por dia
- Taxa de conversão
- Origem de tráfego
- Páginas mais visitadas
- Taxa de bounce

---

## 7. Meta Pixel (Remarketing)

### Instalação
```html
<!-- No <head> de TODAS as páginas -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" 
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/></noscript>
```

### Eventos Principais
```javascript
// Lead (form submit)
fbq('track', 'Lead');

// AddToCart (produto visualizado)
fbq('track', 'AddToCart', {
  value: 17.00,
  currency: 'BRL'
});

// Purchase (pagamento sucesso)
fbq('track', 'Purchase', {
  value: 17.00,
  currency: 'BRL'
});

// ViewContent (página produto)
fbq('track', 'ViewContent', {
  content_ids: ['quiz-001'],
  content_type: 'product'
});
```

### Audiências Customizadas
1. **Visitantes:** Qualquer acesso ao site
2. **Leads:** Enviaram email (form submit)
3. **Quiz Clickers:** Clicaram em quiz CTA
4. **Cart Viewers:** Visualizaram /sessao/ ou /pacote/
5. **Buyers:** Completaram pagamento

---

## Testing de Integrações

### Checklist Completo
- [ ] Formulário envia dados para Netlify
- [ ] Zapier webhook dispara (veja logs)
- [ ] Novo contact aparece em Brevo (60s)
- [ ] Email de welcome chega (60s)
- [ ] GA4 registra page_view (real-time)
- [ ] Meta Pixel dispara evento Lead
- [ ] Eduzz gateway abre sem erros
- [ ] PDF Resend enviado após pagamento

### Debug Tools
- **Netlify:** Site settings → Submissions (veja forms)
- **Zapier:** Zaps → History (veja execuções)
- **Brevo:** Contacts → Search (veja leads criados)
- **GA4:** Real-time (veja eventos ao vivo)
- **Meta Pixel:** Pixel Helper Chrome extension

---

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Formulário não envia | Form precisa `method="POST"` e `name` |
| Zapier não dispara | Verifique webhook URL correta em Netlify |
| Contato não aparece Brevo | Check email duplicado, spam folder, ou erro Zapier |
| GA4 não registra | Verifique GA ID correto (G-XXXXX) |
| Meta Pixel não funciona | Verifique Pixel ID correto no code |
| Eduzz não abre | SSL certficate válido? Testou em incógnito? |

---

## Monitoramento Diário

**Checklist Monitoramento:**
- [ ] GA4: sessionCount, conversion_rate
- [ ] Brevo: novos contacts, email bounce rate
- [ ] Meta Pixel: ROAS, cost per lead
- [ ] Eduzz: transações aprovadas/negadas
- [ ] Netlify: deploy status, build time
