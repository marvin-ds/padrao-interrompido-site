# Segurança Operacional — Correções Fase 1

Data: 2026-05-12

Esta seção resume as correções de baixo risco aplicadas após a auditoria registrada em `/docs/AUDITORIA_SEGURANCA_LGPD.md`.

## Headers de Segurança

O projeto usa o arquivo `/_headers` na raiz para configurar headers servidos pela Netlify em todas as rotas.

Headers configurados:

- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `X-Frame-Options`
- `Content-Security-Policy`

A CSP atual é inicial e moderada. Ela foi desenhada para preservar scripts internos, Google Tag Manager, Google Analytics 4, Meta Pixel, links e frames necessários da Eduzz e fontes do Google Fonts quando usadas.

Teste obrigatório após deploy:

- Google Tag Assistant;
- Meta Pixel Helper;
- GTM Preview;
- GA4 DebugView;
- clique para checkout Eduzz;
- envio real do formulário do ebook.

## Honeypot

O formulário de `/ebook/index.html` possui um campo invisível chamado `website`.

Usuários reais não devem preencher esse campo. Bots simples tendem a preencher todos os inputs. Quando `website` chega preenchido na Function, a submissão é tratada como suspeita:

- não envia para Brevo;
- não envia e-mail pelo Resend;
- retorna uma resposta genérica controlada para não revelar a regra ao bot.

## Timestamp Anti-Bot

O formulário também possui o campo hidden `form_started_at`, preenchido no carregamento com `Date.now()`.

A Function compara esse timestamp com o horário de recebimento. Submissões feitas em menos de 3 segundos são tratadas como suspeitas.

Se o timestamp estiver ausente por alguma falha do navegador, a submissão não é bloqueada imediatamente nesta fase. Isso evita quebrar usuários reais enquanto o comportamento é monitorado.

## Limites Server-Side

A Function `captura-ebook.js` aplica os seguintes limites:

| Campo | Limite |
| --- | --- |
| Body HTTP | 10 KB |
| `nome` | 120 caracteres |
| `email` | 254 caracteres |
| `whatsapp` | 20 dígitos |
| `utm_source` | 150 caracteres |
| `utm_medium` | 150 caracteres |
| `utm_campaign` | 150 caracteres |
| `utm_content` | 150 caracteres |
| `utm_term` | 150 caracteres |
| `origem` | 80 caracteres |
| `campanha` | 150 caracteres |
| `pagina` | 200 caracteres |
| `status_funil` | 80 caracteres |

Campos obrigatórios inválidos são rejeitados. Campos opcionais longos são truncados de forma segura.

## Tratamento de JSON Inválido

Payloads com JSON inválido retornam status `400`, sem cair no erro genérico `500`.

Payloads acima de 10 KB retornam status `413`.

Métodos diferentes de `POST` retornam status `405`.

## Logs

Os logs da Function não devem registrar:

- tokens;
- API keys;
- payload completo;
- nome completo;
- telefone completo;
- e-mail completo.

Em caso de erro, registrar apenas o necessário para diagnóstico técnico, sem expor dados pessoais.

## Testes Manuais Recomendados

1. Abrir `/ebook`.
2. Preencher o formulário normalmente.
3. Confirmar que o lead chega no Brevo.
4. Confirmar que o e-mail chega pelo Resend.
5. Confirmar redirecionamento para `/ebook/obrigado.html`.
6. Testar submissão muito rápida.
7. Testar honeypot preenchido manualmente via DevTools.
8. Testar JSON inválido diretamente na Function.
9. Testar payload acima de 10 KB.
10. Testar Tag Assistant.
11. Testar Meta Pixel Helper.
12. Testar links para Eduzz.

## Ainda Não Implementado

- Banner de cookies.
- Google Consent Mode v2.
- Webhook Eduzz.
- Rate limit real com Redis/Upstash ou storage externo.
- CAPTCHA.
- Meta Conversions API.
- GA4 Measurement Protocol.
- Server-side tracking.

# 🔐 Segurança & Compliance — Checklist

## LGPD (Lei Geral de Proteção de Dados)

### ✅ Implementações Obrigatórias

#### 1. Política de Privacidade Acessível
- [ ] Página `/politica-de-privacidade/` existe
- [ ] Conteúdo mínimo:
  - Descrição de coleta de dados
  - Finalidade de uso
  - Prazo de retenção
  - Direitos do titular
  - Contato do responsável
- [ ] Linguagem clara (não jurídica)
- [ ] Atualizada (últimas 12 meses)

#### 2. Termos de Uso
- [ ] Página `/termos-de-uso/` existe
- [ ] Contém:
  - Aceite de termos
  - Limitações de responsabilidade
  - Política de cancelamento
  - Segurança de dados

#### 3. Consentimento Explícito (Double Opt-in)
```html
<!-- Obrigatório em TODOS os formulários -->
<label>
  <input type="checkbox" name="opt_in" required>
  Aceito receber comunicações e concordo com a 
  <a href="/politica-de-privacidade/">Política de Privacidade</a>
</label>
```

#### 4. Acesso aos Direitos do Titular
- [ ] Email para GDPR requests: `privacidade@padraointerrompido.com.br`
- [ ] SLA de resposta: 30 dias (LGPD)
- [ ] Processo de delete de dados: automático em Brevo/Netlify

#### 5. Segurança de Transmissão
- [ ] HTTPS/SSL ativo (Netlify automático)
- [ ] Redirect HTTP → HTTPS
- [ ] Certificado válido (verificar a cada 90 dias)

---

## GDPR (Europa)

### Diferenças LGPD ↔ GDPR
| Aspecto | LGPD (Brasil) | GDPR (Europa) |
|--------|-------|------|
| **Consentimento** | Opt-in para email | Opt-in + deselect fácil |
| **Retenção** | Conforme necessário | Max 30 dias sem uso |
| **Direito de Acesso** | Sim | Sim (até 24h) |
| **Direito de Delete** | Sim | Sim (right to be forgotten) |
| **Data Protection Officer** | Não obrigatório | Obrigatório (EU) |

### ✅ Implementação GDPR

**Unsubscribe Link (Obrigatório em Email)**
```html
<!-- No footer de TODOS os emails -->
<a href="https://brevo.com/unsub/{{contact.email}}">
  Desinscrever-se
</a>
```

**Cookie Consent (se usar cookies)**
```html
<!-- Antes de GA4/Meta Pixel -->
<div id="cookie-consent">
  <p>Usamos cookies para melhorar sua experiência.</p>
  <button id="accept-cookies">Aceitar</button>
  <button id="reject-cookies">Rejeitar</button>
</div>

<script>
document.getElementById('accept-cookies').addEventListener('click', () => {
  localStorage.setItem('cookie-consent', 'accepted');
  // Ativar GA4/Meta Pixel
});
</script>
```

---

## Segurança Técnica

### ✅ Proteção contra Ataques Comuns

#### 1. XSS (Cross-Site Scripting)
**Risco:** JavaScript malicioso injetado em formulários

**Proteção:**
```javascript
// NUNCA faça isso:
document.innerHTML = userInput; // ❌ INSEGURO

// Faça isso:
document.textContent = userInput; // ✅ Seguro (escapa HTML)

// Ou use sanitização:
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}
```

#### 2. SQL Injection
**Proteção:** Seu site NÃO tem database (static), então está seguro!
- Netlify Forms usa backend seguro
- Zapier valida inputs
- Brevo sanitiza dados

#### 3. CSRF (Cross-Site Request Forgery)
**Proteção:**
```html
<!-- Formulário Netlify (possui CSRF token automático) -->
<form name="contact" method="POST" netlify>
  <!-- Tokens CSRF gerenciados por Netlify automaticamente -->
  <input type="email" name="email" required>
  <button type="submit">Enviar</button>
</form>
```

#### 4. DDoS
**Proteção:**
- Netlify CDN global (distribui tráfego)
- Rate limiting automático
- Anti-bot protections

#### 5. Validação de Entrada
```javascript
// Email validation
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Phone validation (BR)
function validatePhone(phone) {
  const regex = /^(?:\+55)?(?:\(?\d{2}\)?)\s?(?:9\d{4}|\d{4})-?\d{4}$/;
  return regex.test(phone.replace(/[^\d]/g, ''));
}

// Form-level validation
function validateForm(formData) {
  const errors = [];
  
  if (!validateEmail(formData.email)) {
    errors.push('Email inválido');
  }
  
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.push('Telefone inválido');
  }
  
  return errors.length === 0;
}
```

---

## Content Security Policy (CSP)

### Adicionar Headers Netlify
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    # Permitir scripts apenas de domínios confiáveis
    Content-Security-Policy = "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:"
    
    # Prevenir clickjacking
    X-Frame-Options = "SAMEORIGIN"
    
    # Desabilitar MIME-type sniffing
    X-Content-Type-Options = "nosniff"
    
    # Habilitar XSS filter
    X-XSS-Protection = "1; mode=block"
    
    # Referrer policy
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## Proteção de Dados Pessoais

### ✅ Armazenamento Seguro

**Dados coletados:**
- Email
- Nome
- Telefone (opcional)
- IP (via GA4)
- User-Agent (via GA4)

**Onde são armazenados:**
1. **Netlify Forms** — Encrypted at rest, 30 dias (automatic delete)
2. **Brevo CRM** — Encrypted, GDPR compliant
3. **Google Analytics** — Anonymous, 26 meses retenção
4. **Meta Pixel** — Hashed, sem armazenamento direto

### ✅ Retenção de Dados

| Dado | Retenção | Local |
|-----|----------|--------|
| Email | 2 anos (ou até unsubscribe) | Brevo |
| Formulário | 30 dias | Netlify Forms |
| Analytics | 26 meses | Google Analytics |
| Pixel | 1 ano | Meta (US) |

### ✅ Delete de Dados (Right to be Forgotten)

**Fluxo automático:**
```
Usuário solicita delete
  ↓
Email para privacidade@padraointerrompido.com.br
  ↓
Validar identidade
  ↓
Delete em Brevo (API)
  ↓
Delete em Netlify Forms
  ↓
Confirmar por email
  ↓
SLA: 30 dias (LGPD)
```

**Script delete (Brevo API):**
```javascript
async function deleteContact(email) {
  const response = await fetch('https://api.brevo.com/v3/contacts/delete', {
    method: 'POST',
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email })
  });
  
  if (response.ok) {
    console.log(`Contact ${email} deletado`);
    // Notificar usuário
  }
}
```

---

## Checklist de Segurança Pré-Deploy

### Antes de publicar qualquer página:

- [ ] HTTPS/SSL ativo (Netlify automático)
- [ ] Formulários com `method="POST"` e `name`
- [ ] Checkbox de opt-in (LGPD) presente
- [ ] Links para Policy + Terms no footer
- [ ] Sem senhas ou tokens expostos no código
- [ ] `.env` variables NOT commitadas no Git
- [ ] Imagens comprimidas (sem metadados sensíveis)
- [ ] Nenhum console.log() com dados sensíveis
- [ ] CSP headers configurados (netlify.toml)
- [ ] X-Frame-Options = "SAMEORIGIN"
- [ ] Validação de email client-side
- [ ] Scripts de terceiros com crossorigin="anonymous"
- [ ] Nenhuma integração de payment exposta no frontend

### Checklist de Integrações Seguras

#### Eduzz (Pagamento)
- [ ] Links diretos para Eduzz (redirect seguro)
- [ ] NÃO processar pagamento no frontend
- [ ] NÃO armazenar cartão de crédito
- [ ] Webhook de confirmação verificado

#### Brevo (Email)
- [ ] API key em `.env` (não commitada)
- [ ] Apenas 2 keys: email marketing + transacional
- [ ] Rotation de keys a cada 90 dias

#### Resend (Email Transacional)
- [ ] API key em `.env`
- [ ] Template IDs armazenados em config
- [ ] Logging de envios (monitorar bounces)

#### Google Analytics
- [ ] GA ID correto (não testar com dados reais)
- [ ] IP anonymization ativado
- [ ] Exclude interno (seu IP) de tracking
- [ ] Event tracking auditado (sem PII)

#### Meta Pixel
- [ ] Pixel ID correto
- [ ] Nenhum PII em custom data
- [ ] Conversão sem dados sensíveis

---

## Incident Response Plan

### Se houver vazamento de dados:

1. **IMEDIATAMENTE** (< 1 hora)
   - [ ] Desativar integração afetada
   - [ ] Documentar incidente
   - [ ] Notificar Marcos Vinicius

2. **URGENTE** (< 24 horas)
   - [ ] Investigar root cause
   - [ ] Implementar fix
   - [ ] Fazer rollback se necessário
   - [ ] Deploy da correção

3. **COMPLY** (< 48 horas - LGPD)
   - [ ] Notificar usuários afetados
   - [ ] Descrever: quais dados, quando, ações tomadas
   - [ ] Email para: privacidade@padraointerrompido.com.br
   - [ ] Documentar para audit trail

4. **PREVENT**
   - [ ] Post-mortem (o que falhou?)
   - [ ] Testes de segurança adicionais
   - [ ] Atualizar checklist de segurança

---

## Recursos

- [LGPD.AI](https://www.lgpd.ai/) — Guia LGPD em português
- [GDPR Checklist](https://gdprchecklist.io/) — Compliance GDPR
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) — Vulnerabilidades comuns
- [CSP Generator](https://www.cspsv.com/) — Gerar CSP headers
- [SSL Labs](https://www.ssllabs.com/) — Testar HTTPS/SSL

---

**Última atualização:** Maio 2026  
**Próximo review:** Junho 2026 (após Fase 2)
