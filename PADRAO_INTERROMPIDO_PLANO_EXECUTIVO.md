# PADRÃO INTERROMPIDO™ — PLANO EXECUTIVO
## Páginas de Captura, Landing Pages e Páginas de Vendas

**Versão:** 1.0  
**Data:** Maio 2026  
**Operador:** Marcos Vinicius  
**Stack:** Claude Code + Netlify + HTML/CSS puro  
**Repositório:** https://github.com/seu-usuario/padraointerrompido  

---

## I. VISÃO GERAL DO PROJETO

### Objetivo Central
Construir e publicar um site de vendas multi-página que capture leads, qualifique via quiz, e converta para 5 produtos principais, alinhado ao framework PADRÃO INTERROMPIDO™ v4.0 Antifrágil.

### Resultado Esperado em 12 Meses
- **Leads/mês:** 0 → 80 (mês 2) → 500 (mês 12)
- **Sessões/mês:** 0 → 2-4 → 20
- **Revenue/mês:** R$0 → R$1.500-2.500 → R$25.000-35.000

### Princípios de Execução
✅ Antifrágil — melhora com volume e erro  
✅ Camada Dupla — captura emocional + mecanismo técnico  
✅ Ads-safe — 100% compliance  
✅ Iterativo — deploy → teste → ajuste → redeploy  

---

## II. ARQUITETURA DO SITE

### Estrutura de Pastas
```
padrao-interrompido-site/
├── index.html                    # Home (identificação)
├── quiz/index.html               # Quiz R$17 (tripwire)
├── ebook/index.html              # Ebook grátis (lead magnet)
├── sessao/index.html             # Sessão R$250 (high-ticket)
├── pacote/index.html             # Pacote 3x R$650 (commitment)
├── workbook/index.html           # Workbook R$27 (entry)
├── audio/index.html              # Áudio R$47 (entry)
├── politica-de-privacidade/index.html   # Legal
├── termos-de-uso/index.html             # Legal
├── css/
│   ├── global.css                # Estilos compartilhados
│   └── pages.css                 # Variações por página
├── js/
│   ├── global.js                 # Scripts compartilhados
│   ├── forms.js                  # Validação e Zapier
│   └── analytics.js              # GA4 + Meta Pixel
├── assets/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero-home.jpg
│   │   ├── proof-client-1.jpg
│   │   └── ...
│   ├── icons/
│   └── fonts/
├── netlify.toml                  # Configuração deploy
└── .env.example                  # Variáveis de ambiente (NÃO COMMITAR)
```

### URLs Finais (Públicas)
- **Home:** padraointerrompido.com.br/
- **Quiz:** padraointerrompido.com.br/quiz/
- **Ebook:** padraointerrompido.com.br/ebook/
- **Sessão:** padraointerrompido.com.br/sessao/
- **Pacote:** padraointerrompido.com.br/pacote/
- **Workbook:** padraointerrompido.com.br/workbook/
- **Áudio:** padraointerrompido.com.br/audio/
- **Privacy:** padraointerrompido.com.br/politica-de-privacidade/
- **Terms:** padraointerrompido.com.br/termos-de-uso/

---

## III. AS 9 PÁGINAS PRINCIPAIS

### Página 1: HOME (/index.html)
**Função:** Identificação visceral + CTA Quiz  
**Público:** Frio (novo)  
**CTA Principal:** "Fazer o Quiz Diagnóstico"

**Seções:**
1. Hero (gancho brutal + imagem)
2. Pain Points (3 situações específicas)
3. Virada de Percepção (não é força de vontade)
4. Mecanismo (cadeia automática)
5. Prova Social (2-3 cases reais)
6. FAQ (5 perguntas)
7. Footer

**Design:** Responsivo, dark theme (preto/branco/azul petróleo)

---

### Página 2: QUIZ (/quiz/index.html)
**Função:** Conversão primeira compra + Roteamento para trilha  
**Público:** Morno (já identificado)  
**CTA Principal:** "Comprar Quiz (R$17)"

**Seções:**
1. Header com progresso
2. Perguntas (15 total, dinâmicas)
3. Processamento (3s animado)
4. Resultado (perfil + recomendação)
5. Captura email
6. Confirmação + PDF

**Integração:**
- Eduzz (payment)
- Resend (envio PDF)
- Brevo (captura email)
- Zapier (lead routing)

---

### Página 3: EBOOK (/ebook/index.html)
**Função:** Lead magnet + Email capture  
**Público:** Frio (novo)  
**CTA Principal:** "Receber Ebook Grátis"

**Seções:**
1. Hero (valor do ebook)
2. O que você vai aprender (3-4 pontos)
3. Prova (autor, casos)
4. Formulário email
5. Confirmação + Download

**Integração:**
- Netlify Forms (captura)
- Resend (envio ebook)
- Brevo (nutrição)

---

### Página 4: SESSÃO (/sessao/index.html)
**Função:** Venda high-ticket (R$250)  
**Público:** Quente (já qualificado)  
**CTA Principal:** "Agendar Sessão"

**Seções:**
1. Hero (urgência + escassez)
2. O que acontece em uma sessão (timeline)
3. Resultados esperados (observáveis)
4. Prova Social (videos/depoimentos)
5. FAQ (objeções)
6. CTA WhatsApp (booking)

---

### Página 5: PACOTE (/pacote/index.html)
**Função:** Upgrade sessão → pacote  
**Público:** Muito quente (já está em sessão)  
**CTA Principal:** "Contratar Pacote (R$650)"

**Seções:**
1. Hero (diferencial do pacote)
2. Comparativo Avulso vs Pacote
3. Timeline (21 dias + acompanhamento)
4. Garantia
5. Prova Social (clientes que fizeram pacote)
6. FAQ
7. CTA Eduzz

---

### Página 6: WORKBOOK (/workbook/index.html)
**Função:** Entry product (R$27)  
**Público:** Morno (já identificado)  
**CTA Principal:** "Comprar Workbook (R$27)"

**Seções:**
1. Hero (simplicidade)
2. O que está dentro (índice)
3. Para quem é (público-alvo)
4. Resultado esperado
5. Prova Social
6. CTA Eduzz

---

### Página 7: ÁUDIO (/audio/index.html)
**Função:** Entry product (R$47)  
**Público:** Morno  
**CTA Principal:** "Comprar Áudio (R$47)"

**Seções:**
1. Hero (praticidade)
2. Duração e formato
3. Quando usar
4. Resultado esperado
5. Prova Social
6. CTA Eduzz

---

### Página 8: POLÍTICA DE PRIVACIDADE
**Função:** Legal compliance (LGPD)  
**Conteúdo:** Já existe documentado, copiar aqui

---

### Página 9: TERMOS DE USO
**Função:** Legal compliance  
**Conteúdo:** Já existe documentado, copiar aqui

---

## IV. ELEMENTOS COMPARTILHADOS

### Design System
**Cores:**
- Preto: #000000
- Branco: #FFFFFF
- Azul Petróleo: #1B4D5C (CTAs)
- Cinza: #666666 (texto secundário)

**Tipografia:**
- Família: Inter (Google Fonts)
- H1: 32px / Bold (desktop), 24px (mobile)
- Body: 18px / Regular (desktop), 16px (mobile)

**Componentes:**
- Botão primário (CTA azul petróleo)
- Botão secundário (outline)
- Card de prova social
- Hero section (imagem + texto)
- FAQ accordion
- Footer com links legais

### Formulários
**Campos padrão:**
- Email (obrigatório, validação)
- Nome (opcional)
- Telefone/WhatsApp (opcional)
- Opt-in (checked por padrão)

**Integrações:**
- Netlify Forms (captura automática)
- Zapier (webhook para Brevo)
- Resend (envio de email)

### Analytics e Tracking
- Google Analytics 4 (todos os eventos)
- Meta Pixel (remarketing)
- UTM parameters (origem de tráfego)

---

## V. FASES DE EXECUÇÃO

### Fase 1: Foundation (Semana 1-2)
- [ ] Criar estrutura HTML/CSS base
- [ ] Implementar design system
- [ ] Setup Netlify
- [ ] Configurar formulários e integrações
- [ ] Publicar Home + Ebook

**Resultado:** Site funcional em padraointerrompido.com.br com 2 páginas

---

### Fase 2: Core Products (Semana 3-4)
- [ ] Build Quiz page (integração Eduzz + Resend)
- [ ] Build Sessão page
- [ ] Build Pacote page
- [ ] Publicar legal pages
- [ ] Setup tracking (GA4 + Meta)

**Resultado:** 5 páginas de vendas + legal

---

### Fase 3: Complementary Products (Semana 5-6)
- [ ] Build Workbook page
- [ ] Build Áudio page
- [ ] Setup email sequences (Brevo)
- [ ] Create email copy (welcome, nurture)

**Resultado:** 7 páginas de vendas completas

---

### Fase 4: Otimização & Escala (Semana 7+)
- [ ] A/B testing de CTAs
- [ ] Otimização de conversão
- [ ] Setup remarketing
- [ ] Análise de dados
- [ ] Iteração baseada em métricas

---

## VI. CHECKLIST DE CONTEÚDO POR PÁGINA

### HOME
- [ ] Gancho brutal (abertura)
- [ ] 3 situações específicas (alfinete no mapa)
- [ ] Virada de percepção
- [ ] Explicação do mecanismo
- [ ] 2-3 cases reais (prova)
- [ ] 5 FAQs
- [ ] Footer com links

### QUIZ
- [ ] 15 perguntas estruturadas
- [ ] Lógica de roteamento para 16 perfis
- [ ] Tela de resultado com perfil
- [ ] PDF gerado com diagnóstico
- [ ] Email de confirmação
- [ ] Copy de recomendação

### EBOOK
- [ ] Copy de valor
- [ ] 3-4 pontos de aprendizado
- [ ] Bio do autor
- [ ] 1 case específico
- [ ] Formulário funcional
- [ ] PDF disponível para download

### SESSÃO
- [ ] Copy de urgência (vagas limitadas)
- [ ] Timeline de 90 minutos
- [ ] 3 resultados esperados
- [ ] 2-3 depoimentos
- [ ] 5 FAQs (objeções)
- [ ] Botão WhatsApp com script pré-preenchido

### PACOTE
- [ ] Copy de aprofundamento
- [ ] Tabela Avulso vs Pacote
- [ ] Timeline 21 dias
- [ ] Garantia (se houver)
- [ ] Depoimentos de quem fez pacote
- [ ] CTA Eduzz

### WORKBOOK
- [ ] Copy de praticidade
- [ ] Índice (o que dentro)
- [ ] Público-alvo específico
- [ ] 1 resultado esperado
- [ ] 2 cases
- [ ] CTA Eduzz

### ÁUDIO
- [ ] Copy de autonomia
- [ ] Duração exato
- [ ] Exemplo de conteúdo
- [ ] Quando usar
- [ ] 2 cases
- [ ] CTA Eduzz

### LEGAL
- [ ] Política de Privacidade (copiar)
- [ ] Termos de Uso (copiar)
- [ ] Links no footer

---

## VII. INTEGRAÇÃO COM ECOSSISTEMA

### Fluxo Completo de Lead
```
Landing (Home/Ebook) 
  ↓ (email capture)
Brevo (welcome + nutrição)
  ↓ (semanal)
Quiz page (/quiz/)
  ↓ (R$17 pagamento)
Eduzz (processo Stripe)
  ↓ (sucesso)
Resend (PDF enviado)
  ↓
Brevo (segmentação por perfil)
  ↓ (nutrição por 14 dias)
Página de produto específico
  ↓ (R$27-650)
WhatsApp/Eduzz (conversão final)
  ↓
Marcos (atendimento)
```

### Plataformas Conectadas
- **Netlify:** Hospedagem + formulários
- **Zapier:** Automação (forms → Brevo)
- **Brevo:** Email marketing + nutrição
- **Resend:** Email transacional (PDFs)
- **Eduzz:** Gateway pagamento (Quiz, produtos)
- **Google Analytics:** Tracking conversão
- **Meta Pixel:** Remarketing

---

## VIII. MÉTRICAS DE SUCESSO

### Mês 1 (Foundation)
- [ ] Site online e funcional
- [ ] Primeira página (Home) com <2s de carregamento
- [ ] Formulário capturando emails
- [ ] 0-5 leads/dia

### Mês 2 (Core Launch)
- [ ] 5 páginas de vendas publicadas
- [ ] 20+ leads/semana
- [ ] 2-4 sessões/mês agendadas
- [ ] 1-2 produtos vendidos

### Mês 3 (Otimização)
- [ ] 7 páginas de vendas
- [ ] 40+ leads/semana
- [ ] 6+ sessões/mês
- [ ] 4-6 produtos vendidos
- [ ] R$3.000-5.000/mês

---

## IX. PRÓXIMOS PASSOS IMEDIATOS

### Semana 1:
1. [ ] Responder 3 perguntas (território, CTA, páginas)
2. [ ] Criar repositório GitHub (`padraointerrompido`)
3. [ ] Conectar GitHub ao Netlify
4. [ ] Clonar para pasta local (`padrao-interrompido-site`)
5. [ ] EU: Criar estrutura HTML/CSS base no Claude Code

### Semana 2:
6. [ ] VOCÊ: Baixar arquivos, testar localmente
7. [ ] VOCÊ: Fazer push para GitHub (git push)
8. [ ] Netlify: Deploy automático ativado
9. [ ] Configurar domínio customizado (padraointerrompido.com.br)
10. [ ] Publicar Home + Ebook pages

---

## X. DÚVIDAS FREQUENTES

**P: Quanto tempo leva construir tudo?**  
R: Fase 1-2 (core) = 2-3 semanas. Fase 3-4 (polish) = 2-4 semanas. Total = 4-7 semanas até full stack pronto.

**P: Preciso de conhecimento técnico?**  
R: Não. Você valida páginas localmente (abre arquivo .html no navegador). Eu crio. Você testa. Você faz push.

**P: Como função "x" será integrada?**  
R: Veja fluxo completo em Seção VII. Todas as integrações estão mapeadas (Brevo, Eduzz, Zapier, etc).

**P: E se eu quiser mudar algo depois?**  
R: Edita arquivo local, testa, faz push. Netlify redeploy automaticamente em 30 segundos.

---

## XI. DOCUMENTAÇÃO REFERENCIAL

Para aprofundamento, consulte:
1. **PADRÃO_INTERROMPIDO_FRAMEWORK_v4.0** — Mecânica e mecanismo
2. **04-esteira-comercial-funil.md** — 16 perfis e produtos
3. **03-matriz-estrategica.md** — Matriz de conteúdo
4. **QUIZ_WIREFRAME_COMPLETO.md** — Especificações técnicas quiz

---

**Versão:** 1.0  
**Última atualização:** Maio 2026  
**Status:** Pronto para execução via Claude Code + Netlify  
**Próximo Review:** Após Fase 1 (semana 2)
