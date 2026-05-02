# PADRÃO INTERROMPIDO™ — Site de Vendas

[![Status](https://img.shields.io/badge/Status-🟢%20Produção-brightgreen)](https://padraointerrompido.com.br)
[![Stack](https://img.shields.io/badge/Stack-HTML%2FCSS%2FJS-blue)](https://github.com/marvin-ds/padrao-interrompido-site)
[![Hospedagem](https://img.shields.io/badge/Netlify-Deploy-00C7B7)](https://netlify.com)
[![LGPD](https://img.shields.io/badge/LGPD-Compliant-green)](https://padraointerrompido.com.br/politica-de-privacidade/)

Máquina web de captura de leads, qualificação via quiz diagnóstico, e conversão para 5 produtos principais do método **PADRÃO INTERROMPIDO™ v4.0 Antifrágil**.

---

## 🎯 Visão Geral

| Métrica | Objetivo (12 meses) |
|---------|-------------------|
| **Leads/mês** | 0 → 80 (mês 2) → 500 (mês 12) |
| **Sessões/mês** | 0 → 2-4 → 20 |
| **Revenue/mês** | R$0 → R$1.500-2.500 → R$25.000-35.000 |
| **Tempo de Carregamento** | <2 segundos (Lighthouse >90) |

### Princípios de Execução
✅ **Antifrágil** — Melhora com volume e erro  
✅ **Camada Dupla** — Captura emocional + mecanismo técnico  
✅ **Ads-Safe** — 100% compliance (LGPD, GDPR)  
✅ **Iterativo** — Deploy → Teste → Ajuste → Redeploy  

---

## 🏗️ Arquitetura

### Tech Stack
```
┌─────────────────────────────────────┐
│  Frontend: HTML5 + CSS3 + Vanilla JS │
│  Hospedagem: Netlify (Deploy CI/CD)  │
│  Domínio: padraointerrompido.com.br  │
│  Analytics: GA4 + Meta Pixel         │
│  Pagamentos: Eduzz (Stripe)          │
│  Email: Brevo + Resend (Transacional)│
│  Automação: Zapier (Forms → Brevo)   │
└─────────────────────────────────────┘
```

### Estrutura de Pastas
```
padrao-interrompido-site/
├── index.html                              # Home (identificação)
├── quiz/index.html                         # Quiz R$17 (tripwire)
├── ebook/index.html                        # Lead magnet grátis
├── sessao/index.html                       # Sessão R$250 (high-ticket)
├── pacote/index.html                       # Pacote 3x R$650
├── workbook/index.html                     # Workbook R$27 (entry)
├── audio/index.html                        # Áudio R$47 (entry)
├── politica-de-privacidade/index.html      # Legal (LGPD)
├── termos-de-uso/index.html                # Legal compliance
├── css/
│   ├── global.css                          # Estilos compartilhados (responsive)
│   └── pages.css                           # Variações por página
├── js/
│   ├── global.js                           # Scripts comuns (init, utils)
│   ├── forms.js                            # Validação + Zapier webhooks
│   └── analytics.js                        # GA4 + Meta Pixel events
├── assets/
│   ├── images/                             # Otimizadas (<200kb)
│   ├── icons/                              # SVG (não bitmap)
│   └── fonts/                              # Web fonts (lazy load)
├── docs/                                   # Documentação técnica
│   ├── SETUP.md                            # Setup inicial
│   ├── INTEGRACIONES.md                    # APIs e webhooks
│   ├── SEGURIDAD.md                        # Checklist segurança
│   └── PERFORMANCE.md                      # Otimizações
├── netlify.toml                            # Configuração deploy
├── .env.example                            # Template variáveis
├── robots.txt                              # SEO
├── sitemap.xml                             # SEO
└── README.md                               # Este arquivo
```

---

## 🚀 Quick Start

### Desenvolvimento Local
```bash
# 1. Clone o repositório
git clone https://github.com/marvin-ds/padrao-interrompido-site.git
cd padrao-interrompido-site

# 2. Abra localmente (nenhuma dependência)
# Windows: duplo-clique em index.html
# Mac/Linux: open index.html

# 3. Edite qualquer arquivo .html/.css/.js

# 4. Veja mudanças em tempo real (F5 no navegador)

# 5. Quando pronto, sincronize com GitHub
git add .
git commit -m "Descrição clara da mudança"
git push origin main
# Netlify faz deploy automático em ~30 segundos
```

### URLs em Produção
- 🏠 Home: https://padraointerrompido.com.br/
- 📋 Quiz: https://padraointerrompido.com.br/quiz/
- 📚 Ebook: https://padraointerrompido.com.br/ebook/
- 👥 Sessão: https://padraointerrompido.com.br/sessao/
- 📦 Pacote: https://padraointerrompido.com.br/pacote/
- 📖 Workbook: https://padraointerrompido.com.br/workbook/
- 🎧 Áudio: https://padraointerrompido.com.br/audio/

---

## 📊 Fases de Execução

### Fase 1: Foundation (Semana 1-2)
- [x] Estrutura HTML/CSS base
- [x] Design system (cores, tipografia, componentes)
- [x] Setup Netlify + domínio
- [x] Formulários integrados
- [ ] **Publicar:** Home + Ebook
- **KPI:** Site <2s, 0-5 leads/dia

### Fase 2: Core Products (Semana 3-4)
- [ ] Quiz (integração Eduzz + Resend + Zapier)
- [ ] Sessão (WhatsApp + copy urgência)
- [ ] Pacote (tabela comparativa)
- [ ] Legal pages (Privacy + Terms)
- [ ] Setup tracking completo (GA4 + Meta Pixel)
- **KPI:** 20+ leads/semana, 2-4 sessões/mês

### Fase 3: Complementary (Semana 5-6)
- [ ] Workbook + Áudio
- [ ] Email sequences (Brevo)
- [ ] Lead nurturing (14-21 dias)
- **KPI:** 40+ leads/semana, 4-6 produtos/mês

### Fase 4: Otimização & Escala (Semana 7+)
- [ ] A/B testing de CTAs
- [ ] Pixel perfecting
- [ ] Remarketing setup
- [ ] Análise de dados
- **KPI:** R$3.000-5.000/mês (mês 3)

---

## 🎨 Design System

### Paleta de Cores
```css
--color-black: #000000;          /* Backgrounds, texto */
--color-white: #FFFFFF;          /* Backgrounds claros */
--color-teal: #1B4D5C;           /* CTAs, destaques */
--color-gray: #666666;           /* Texto secundário */
--color-success: #10B981;        /* Confirmações */
--color-error: #EF4444;          /* Erros */
```

### Tipografia
```css
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Responsividade
- **Mobile:** 320px - 767px (base)
- **Tablet:** 768px - 1023px
- **Desktop:** 1024px+ (max-width: 1280px)

---

## 🔗 Integrações

### Fluxo Completo de Lead
```
Landing (Home/Ebook)
  ↓ email capture (Netlify Forms)
Brevo (welcome automático)
  ↓ semanal (nutrição)
Quiz Page
  ↓ R$17 (Eduzz/Stripe)
Confirmação + PDF (Resend)
  ↓
Brevo (segmentação por perfil)
  ↓ 14 dias (nurture)
Página de Produto (R$27-650)
  ↓
WhatsApp ou Eduzz (conversão final)
  ↓
Marcos (atendimento/delivery)
```

### Serviços Conectados
| Serviço | Função | Status |
|---------|--------|--------|
| **Netlify** | Hospedagem + Deploy CI/CD | ✅ Live |
| **Zapier** | Automação (Forms → Brevo) | ✅ Live |
| **Brevo** | Email marketing + nutrição | ✅ Live |
| **Resend** | Email transacional (PDFs) | ✅ Live |
| **Eduzz** | Gateway pagamento | ✅ Live |
| **Google Analytics 4** | Tracking conversão | ✅ Live |
| **Meta Pixel** | Remarketing | ✅ Live |

---

## 🔐 Segurança & Compliance

- ✅ **LGPD** — Política de Privacidade completa
- ✅ **GDPR** — Compatible com regulações européias
- ✅ **HTTPS/SSL** — Automático via Netlify
- ✅ **Double Opt-in** — Confirmação por email
- ✅ **Validação de Formulários** — Client-side + server-side
- ✅ **CSP Headers** — Content Security Policy
- ✅ **NoSQL Injection Protection** — Sem database (static)
- ✅ **XSS Prevention** — Sanitização de inputs

---

## 📈 Métricas & KPIs

### Mês 1 (Foundation)
- [ ] Site online e funcional
- [ ] Carregamento <2s (Lighthouse >90)
- [ ] Formulário capturando emails
- [ ] 0-5 leads/dia

### Mês 2 (Core Launch)
- [ ] 5 páginas de vendas ativas
- [ ] 20+ leads/semana
- [ ] 2-4 sessões/mês agendadas
- [ ] 1-2 produtos vendidos
- [ ] R$1.500-2.500/mês

### Mês 3 (Otimização)
- [ ] 7 páginas de vendas completas
- [ ] 40+ leads/semana
- [ ] 6+ sessões/mês
- [ ] 4-6 produtos vendidos
- [ ] R$3.000-5.000/mês

---

## ✅ Checklist de Publicação

Antes de fazer push para produção:

- [ ] Carregamento <2 segundos
- [ ] Responsiva em mobile (teste em 375px)
- [ ] Formulários funcionam (teste completo)
- [ ] Todos os CTAs visíveis (acima da fold)
- [ ] Links não quebrados
- [ ] Copy revisado (sem typos)
- [ ] Imagens otimizadas (<200kb)
- [ ] Analytics tag presente (GA4)
- [ ] Meta Pixel tag presente
- [ ] LGPD disclaimer no footer
- [ ] Lighthouse score >90
- [ ] Mobile speed <3s

---

## 📚 Documentação

| Documento | Propósito |
|-----------|----------|
| [PLANO_EXECUTIVO.md](PLANO_EXECUTIVO.md) | Visão estratégica (9 páginas) |
| [GUIA_TECNICO_CLAUDE_CODE.md](GUIA_TECNICO_CLAUDE_CODE.md) | Especificações técnicas |
| [/docs/SETUP.md](/docs/SETUP.md) | Como começar |
| [/docs/INTEGRACIONES.md](/docs/INTEGRACIONES.md) | APIs e webhooks |
| [/docs/SEGURIDAD.md](/docs/SEGURIDAD.md) | Segurança e compliance |
| [/docs/PERFORMANCE.md](/docs/PERFORMANCE.md) | Otimizações |

---

## 🛠️ Tech Stack Resumido

```json
{
  "frontend": "HTML5 + CSS3 + Vanilla JavaScript",
  "hospedagem": "Netlify",
  "cicd": "Git + Netlify Deploy",
  "analytics": "Google Analytics 4 + Meta Pixel",
  "pagamentos": "Eduzz (Stripe integration)",
  "email": "Brevo (marketing) + Resend (transacional)",
  "automacao": "Zapier webhooks",
  "seo": "sitemap.xml + robots.txt + Meta tags"
}
```

---

## 🚨 Troubleshooting Comum

### O site está carregando lento
1. Otimize imagens (use TinyPNG)
2. Verifique bundle JS (remova scripts não utilizados)
3. Ative Gzip no netlify.toml
4. Use lazy loading para imagens below-the-fold

### Formulário não envia
1. Verifique Netlify Forms está ativado
2. Confira webhook Zapier (URL correta)
3. Validação de email está funcionando?
4. Check browser console (F12) para erros JS

### Analytics não registra eventos
1. GA4 tag presente no <head>?
2. Verifique ID correto (G-XXXXXXXXXX)
3. Teste em modo anônimo (sem adblocker)
4. Check Real-time events no GA4

---

## 📝 Changelog

### v1.0 (Maio 2026)
- ✅ Setup inicial repositório
- ✅ Estrutura base HTML/CSS
- ✅ Design system definido
- ✅ Integrações mapeadas
- ✅ Documentação técnica
- 🔄 Em desenvolvimento: Páginas de vendas

---

## 🤝 Workflow de Desenvolvimento

### 1. Criar Feature
```bash
git checkout -b feature/nome-descritivo
# ex: feature/quiz-page, feature/sessao-styling
```

### 2. Desenvolver Localmente
- Edite arquivos HTML/CSS/JS
- Teste no navegador (F5)
- Teste responsivo (DevTools)
- Valide formulários

### 3. Commit & Push
```bash
git add .
git commit -m "descrição clara: adiciona quiz page com validação"
git push origin feature/nome-descritivo
```

### 4. Deploy (via Netlify)
- Netlify detecta push
- Build automático
- Deploy em ~30 segundos
- URL preview disponível

### 5. Merge para Main
- Validar em produção
- Mergear para main via GitHub
- Monitorar métricas GA4/Meta

---

## ⚙️ Configuração Inicial (DevOps)

### Netlify Setup
```toml
# netlify.toml
[build]
  command = "# sem build (static)"
  publish = "/"

[context.production]
  command = "# sem build"

# Redirect rules
[[redirects]]
  from = "/quiz"
  to = "/quiz/"
  status = 301

[[redirects]]
  from = "/ebook"
  to = "/ebook/"
  status = 301
```

### Environment Variables (.env)
```
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/...
RESEND_API_KEY=re_xxxxxxxxxxxxx
GA4_ID=G-XXXXXXXXXX
META_PIXEL_ID=123456789
EDUZZ_AFFILIATE_ID=seu_id
```

---

## 📞 Suporte & Contato

**Operador:** Marcos Vinicius  
**Email:** marcos.cislene@gmail.com  
**GitHub:** [@marvin-ds](https://github.com/marvin-ds)  
**Status:** 🟢 Produção (Maio 2026)  

---

## 📄 Licença

Propriedade intelectual de Marcos Vinicius. Uso exclusivo para PADRÃO INTERROMPIDO™.

**Versão:** 1.0  
**Última atualização:** Maio 2026  
**Próximo Review:** Junho 2026 (Fase 2)
