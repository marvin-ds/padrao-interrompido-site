# PADRÃO INTERROMPIDO™ — Site de Vendas

Landing pages, páginas de captura e vendas do método de hipnoterapia aplicada a padrões automáticos.

## 🎯 Objetivo

Máquina web de captura de leads, qualificação via quiz diagnóstico, e conversão para 5 produtos principais (Sessão R$250, Pacote R$650, Workbook R$27, Áudio R$47).

## 🏗️ Arquitetura

- **Framework:** HTML/CSS puro (sem build)
- **Hospedagem:** Netlify (grátis, deploy automático)
- **Domínio:** padraointerrompido.com.br
- **Responsivo:** Mobile-first (90% mobile traffic)
- **Analytics:** Google Analytics 4 + Meta Pixel

## 📁 Estrutura do Projeto

```
padrao-interrompido-site/
├── index.html                          # Home
├── quiz/index.html                     # Quiz diagnóstico (R$17)
├── ebook/index.html                    # Lead magnet grátis
├── sessao/index.html                   # Sessão (R$250)
├── pacote/index.html                   # Pacote (R$650)
├── workbook/index.html                 # Workbook (R$27)
├── audio/index.html                    # Áudio (R$47)
├── politica-de-privacidade/index.html  # Legal
├── termos-de-uso/index.html            # Legal
├── css/
│   ├── global.css                      # Estilos compartilhados
│   └── pages.css                       # Variações por página
├── js/
│   ├── global.js                       # Scripts comuns
│   ├── forms.js                        # Validação + Zapier
│   └── analytics.js                    # GA4 + Meta Pixel
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── netlify.toml                        # Configuração Netlify
└── README.md                           # Este arquivo
```

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/padraointerrompido.git
cd padraointerrompido

# 2. Abra a página localmente
# No Windows: abra a pasta em arquivo explorador, dê duplo-clique em index.html
# No Mac/Linux: open index.html (ou arraste para navegador)

# 3. Edite os arquivos com seu editor favorito
# VS Code, Sublime, Notepad++, etc — qualquer editor de texto

# 4. Veja mudanças em tempo real (F5 no navegador)

# 5. Quando estiver pronto, faça push
git add .
git commit -m "Descreva o que mudou"
git push origin main

# Netlify faz deploy automaticamente em ~30 segundos
```

### URLs em Produção

- Home: https://padraointerrompido.com.br/
- Quiz: https://padraointerrompido.com.br/quiz/
- Ebook: https://padraointerrompido.com.br/ebook/
- Sessão: https://padraointerrompido.com.br/sessao/
- Pacote: https://padraointerrompido.com.br/pacote/

## 📊 Fases de Execução

### Fase 1: Foundation (Semana 1-2)
- [ ] Estrutura HTML/CSS base
- [ ] Home page
- [ ] Ebook landing page
- [ ] Formulários funcionando

### Fase 2: Core Products (Semana 3-4)
- [ ] Quiz page (integração Eduzz + Resend)
- [ ] Sessão page
- [ ] Pacote page
- [ ] Legal pages (Privacy + Terms)

### Fase 3: Complementary (Semana 5-6)
- [ ] Workbook page
- [ ] Áudio page
- [ ] Email sequences
- [ ] Remarketing setup

### Fase 4: Otimização (Semana 7+)
- [ ] A/B testing
- [ ] Conversão otimizada
- [ ] Análise de dados

## 🎨 Design System

**Cores:**
- Preto: `#000000`
- Branco: `#FFFFFF`
- Azul Petróleo (CTAs): `#1B4D5C`
- Cinza (secundário): `#666666`

**Tipografia:**
- Fonte: Inter (Google Fonts)
- H1: 32px bold (desktop), 24px (mobile)
- Body: 18px regular (desktop), 16px (mobile)

## 🔗 Integrações

### Fluxo de Lead Completo

```
Landing Page (captura email)
      ↓ (Netlify Forms)
Brevo (nutrição automática)
      ↓ (14 dias)
Quiz Page (R$17)
      ↓ (pagamento)
Eduzz (Stripe)
      ↓
Resend (PDF diagnóstico)
      ↓
Brevo (segmentação)
      ↓ (14 dias nutrição)
Página de Produto (R$27-650)
      ↓
WhatsApp / Eduzz (conversão)
```

### Serviços Conectados

| Serviço | Função | Status |
|---------|--------|--------|
| Netlify | Hospedagem + Deploy | ✅ Live |
| Zapier | Automação (forms → Brevo) | ✅ Live |
| Brevo | Email marketing | ✅ Live |
| Resend | Email transacional | ✅ Live |
| Eduzz | Gateway pagamento | ✅ Live |
| GA4 | Analytics | ✅ Live |
| Meta Pixel | Remarketing | ✅ Live |

## 📈 Métricas de Sucesso

**Mês 1:**
- Site online com <2s carregamento
- 0-5 leads/dia

**Mês 2:**
- 20+ leads/semana
- 2-4 sessões agendadas/mês
- 1-2 produtos vendidos

**Mês 3:**
- 40+ leads/semana
- 6+ sessões/mês
- 4-6 produtos/mês
- R$3.000-5.000/mês

## 🔐 Segurança & Compliance

- ✅ LGPD (Política de Privacidade)
- ✅ GDPR compatible
- ✅ HTTPS/SSL (automático Netlify)
- ✅ Double opt-in (confirmação por email)

## 📋 Checklist de Publicação

Antes de fazer push para produção:

- [ ] Página carrega em <2 segundos
- [ ] Responsiva em mobile (teste em 375px)
- [ ] Formulários funcionam (teste de verdade)
- [ ] CTAs claramente visíveis
- [ ] Links não quebrados
- [ ] Copy revisado (sem typos)
- [ ] Imagens otimizadas (<200kb)
- [ ] Analytics tag presente (GA4)
- [ ] Meta Pixel tag presente
- [ ] LGPD disclaimer presente

## 📞 Contato & Suporte

**Operador:** Marcos Vinicius  
**Email:** contato@padraointerrompido.com.br  
**WhatsApp:** [Link nos footers das páginas]

## 📚 Referência Documentação

Para aprofundamento técnico, consulte:

1. **PADRÃO_INTERROMPIDO_FRAMEWORK_v4.0.txt** — Mecânica do sistema
2. **04-esteira-comercial-funil.md** — 16 perfis + produtos
3. **03-matriz-estrategica.md** — Matriz de conteúdo
4. **QUIZ_WIREFRAME_COMPLETO.md** — Specs técnicas quiz
5. **PLANO_EXECUTIVO.md** — Este projeto

## 🛠️ Tech Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML5 + CSS3 |
| Hospedagem | Netlify |
| CI/CD | Git + Netlify Deploy |
| Analytics | Google Analytics 4 |
| Pagamentos | Eduzz |
| Email | Brevo + Resend |
| Automação | Zapier |

## 📝 Changelog

### v1.0 (Maio 2026)
- ✅ Setup inicial
- ✅ Home page
- ✅ Ebook landing
- ✅ Quiz infrastructure
- ✅ Legal pages

## 🤝 Contribuição

1. Crie uma branch: `git checkout -b feature/nome`
2. Faça suas mudanças
3. Commit: `git commit -m "descrição clara"`
4. Push: `git push origin feature/nome`
5. Abra Pull Request (se aplicável)

## ⚖️ Licença

Propriedade de Marcos Vinicius. Uso exclusivo para PADRÃO INTERROMPIDO™.

---

**Versão:** 1.0  
**Última atualização:** Maio 2026  
**Status:** 🟢 Produção  
**Próximo Review:** Junho 2026
