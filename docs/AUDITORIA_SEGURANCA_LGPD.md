# Auditoria de Segurança, LGPD e Infraestrutura

Projeto: Padrão Interrompido™
Data da auditoria: 2026-05-12
Escopo: site HTML estático em Netlify, Netlify Functions, Brevo, Resend, Eduzz, quiz externo em Vercel, GTM, GA4, Meta Pixel, UTMs, políticas e documentação.

> Este relatório é uma auditoria técnica e operacional. Não substitui parecer jurídico sobre LGPD, contratos com operadores ou políticas públicas.

## 1. Resumo Executivo

O projeto já possui uma base funcional para captura de leads, envio transacional do ebook e rastreamento do funil. A estrutura está razoavelmente organizada: `.env` não está versionado, `.env.example` usa placeholders, o endpoint de captura aceita apenas `POST`, valida campos básicos e usa variáveis de ambiente para Brevo e Resend.

Os riscos prioritários antes de escalar tráfego pago são:

1. **Ausência de headers de segurança no Netlify.**
2. **Ausência de rate limit e anti-bot no formulário público do ebook.**
3. **Disparo de tags de marketing antes de consentimento granular.**
4. **Function sem limite máximo de tamanho de campos/body.**
5. **Política de privacidade parcialmente desalinhada com a stack atual.**
6. **Compra Eduzz ainda sem webhook seguro para confirmar `purchase`/`comprou_quiz`.**

Não foram encontradas credenciais reais hardcoded nos arquivos analisados, excluindo o `.env` local, que não foi lido e não está rastreado pelo Git.

## 2. Referências Técnicas Usadas

- OWASP Top 10 Web Application Security Risks: https://owasp.org/www-project-top-ten/
- OWASP API Security Top 10 2023: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
- OWASP API Security Project: https://owasp.org/API-Security/
- Guia de Segurança da Informação para Agentes de Tratamento de Pequeno Porte da ANPD: https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-guia-de-seguranca-para-agentes-de-tratamento-de-pequeno-porte

## 3. Escopo Analisado

### Arquivos HTML públicos e templates

- `/index.html`
- `/TEMPLATE-BASE.html`
- `/home/index.html`
- `/ebook/index.html`
- `/ebook/obrigado.html`
- `/quiz/index.html`
- `/quiz-mpi/index.html`
- `/politica-de-privacidade/index.html`
- `/termos-de-uso/index.html`

### Scripts

- `/js/tracking.js`
- `/js/ebook-captura.js`
- `/js/global.js`
- `/js/analytics.js`

### Functions

- `/netlify/functions/captura-ebook.js`

### Configuração e documentação

- `/netlify.toml`
- `/.gitignore`
- `/.env.example`
- `/package.json`
- `/package-lock.json`
- `/docs/RASTREAMENTO.md`
- `/docs/VARIAVEIS_AMBIENTE.md`
- `/docs/FUNIL_EBOOK_QUIZ_AGENTES.md`
- `/docs/SEGURANCA.md`
- `/docs/INTEGRACOES.md`
- `/docs/SETUP.md`
- `/README.md`
- `/README_GITHUB.md`

## 4. Mapa do Fluxo de Dados

```text
/ebook
 ↓
Lead preenche nome, e-mail, WhatsApp, consentimento e UTMs
 ↓
JavaScript envia POST para /.netlify/functions/captura-ebook
 ↓
Netlify Function valida dados
 ↓
Brevo cria/atualiza contato
 ↓
Resend envia e-mail transacional com link do ebook e CTA para /quiz-mpi
 ↓
/ebook/obrigado.html
 ↓
Lead pode clicar para WhatsApp ou /quiz-mpi
 ↓
/quiz-mpi ou /quiz
 ↓
Clique para checkout Eduzz
 ↓
Compra deve ser confirmada futuramente por webhook Eduzz
```

## 5. Inventário de Integrações

| Integração | Onde aparece | Função | Observação |
| --- | --- | --- | --- |
| Netlify | `netlify.toml`, Function | Hospedagem e serverless | Sem headers customizados ainda. |
| Brevo | `captura-ebook.js` | CRM simples e nutrição | Cria/atualiza contato via API. |
| Resend | `captura-ebook.js` | E-mail transacional | Envia ebook por link. |
| Eduzz | `/quiz`, `/quiz-mpi` | Checkout | Links usam `chk.eduzz.com/E05NO54G9X` com UTMs. |
| GTM | todos os HTMLs | Tag manager | Instalado em `<head>` e noscript após `<body>`. |
| GA4 | todos os HTMLs | Analytics | ID `G-QJ7PW4HBRQ`. |
| Meta Pixel | todos os HTMLs | Marketing/pixel | ID `541342531532855`. |
| WhatsApp | obrigado/termos/script | Atendimento opcional | Número atual `5513997615872`. |
| Vercel | documentação/contexto | Quiz externo | Não há endpoint local analisável neste repo. |
| GitHub | versionamento | Controle de versão | `.env` não rastreado. |

## 6. Achados por Severidade

### Alto — Headers de segurança ausentes

**Descrição:** Não existe arquivo `_headers` e o `netlify.toml` atual contém apenas configuração de build/functions.

**Risco:** Sem HSTS, CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` e proteção de framing, o site fica mais exposto a misconfiguration, clickjacking, carregamento indevido de recursos e vazamento de referrer.

**Evidência:** `/netlify.toml`; ausência de `/_headers`.

**Recomendação:** Criar headers no `netlify.toml` ou `_headers`. Para este projeto, `_headers` tende a ser simples e explícito. Começar com CSP moderada que preserve GTM, GA4, Meta Pixel, Eduzz, fontes e scripts internos.

**Prioridade:** Alta.
**Esforço:** Médio.

### Alto — Function pública sem rate limit

**Descrição:** `/.netlify/functions/captura-ebook` recebe leads e aciona Brevo/Resend, mas não há rate limit por IP, e-mail ou fingerprint.

**Risco:** Abuso automatizado pode gerar custo, poluir Brevo, disparar spam pelo Resend e degradar reputação de domínio.

**Evidência:** `/netlify/functions/captura-ebook.js`.

**Recomendação:** Implementar camadas progressivas: honeypot + timestamp agora; rate limit com storage externo depois; CAPTCHA apenas se houver abuso.

**Prioridade:** Alta.
**Esforço:** Baixo para honeypot/timestamp; médio/alto para rate limit real.

### Alto — Pixels e cookies disparam antes de consentimento granular

**Descrição:** GTM, GA4 e Meta Pixel carregam diretamente no `<head>` de todos os HTMLs e disparam `PageView` antes de qualquer banner/preferência.

**Risco:** Potencial desalinhamento entre prática de rastreamento e expectativa de transparência/consentimento, especialmente para marketing/pixels.

**Evidência:** Todos os HTMLs analisados; `/docs/RASTREAMENTO.md`.

**Recomendação:** Planejar banner de cookies, categorias de consentimento e Google Consent Mode v2 via GTM. Como correção imediata documental, atualizar política para explicar claramente pixels/localStorage.

**Prioridade:** Alta antes de escalar mídia.
**Esforço:** Médio.

### Médio — Campos do formulário e body sem limites máximos

**Descrição:** A Function valida presença, e-mail e tamanho mínimo do WhatsApp, mas não limita tamanho máximo de `nome`, `email`, `whatsapp`, UTMs, `origem`, `campanha`, `pagina` ou body bruto.

**Risco:** Abuso de payload, custo desnecessário, logs mais ruidosos e maior exposição a inputs inesperados.

**Evidência:** `/netlify/functions/captura-ebook.js`.

**Recomendação:** Definir limites: `nome` até 120, `email` até 254, `whatsapp` até 20 dígitos, UTMs até 150, `pagina` até 200, body até 10 KB.

**Prioridade:** Alta.
**Esforço:** Baixo.

### Médio — Formulário sem honeypot e timestamp anti-bot

**Descrição:** `/ebook/index.html` possui formulário funcional com consentimento, mas não há honeypot nem timestamp mínimo de permanência.

**Risco:** Bots simples conseguem submeter diretamente.

**Evidência:** `/ebook/index.html` linhas do formulário `formEbook`.

**Recomendação:** Adicionar campo honeypot invisível e campo `form_started_at`, validado server-side. Bloquear submissões rápidas demais.

**Prioridade:** Alta.
**Esforço:** Baixo.

### Médio — Política de privacidade desalinhada com a stack atual

**Descrição:** A política menciona Google Sheets, Supabase, SendGrid, Hotmart, Telegram e IA como operadores/processadores, enquanto a stack atual documentada é Brevo, Resend, Eduzz, Netlify, GitHub, Google, Meta e Vercel.

**Risco:** Transparência incompleta ou imprecisa sobre operadores e finalidades.

**Evidência:** `/politica-de-privacidade/index.html`.

**Recomendação:** Atualizar a política para refletir a stack real, separando ferramentas ativas, ferramentas futuras e ferramentas não utilizadas.

**Prioridade:** Alta antes de tráfego pago.
**Esforço:** Médio.

### Médio — Compra Eduzz ainda sem webhook seguro

**Descrição:** O projeto rastreia clique de checkout, mas não há Function para webhook Eduzz confirmando compra real.

**Risco:** `begin_checkout` pode ser confundido com compra. Não se deve marcar `comprou_quiz` no Brevo com base em clique ou URL.

**Evidência:** Ausência de Function Eduzz; `/docs/RASTREAMENTO.md` documenta `purchase` como pendente.

**Recomendação:** Criar webhook Eduzz separado, validar assinatura/token, confirmar status da transação e atualizar Brevo somente após evento confiável.

**Prioridade:** Média antes de otimização de mídia.
**Esforço:** Médio/alto.

### Médio — Duplicidade conceitual entre tags diretas e GTM

**Descrição:** GTM, GA4 e Meta Pixel estão instalados diretamente em todos os HTMLs. Isso funciona, mas no futuro pode duplicar eventos se GA4/Meta também forem configurados dentro do GTM.

**Risco:** Eventos duplicados e dados inflados.

**Evidência:** Todos os HTMLs e `/docs/RASTREAMENTO.md`.

**Recomendação:** Manter como está por enquanto, mas documentar regra: se migrar GA4/Meta para GTM, remover as tags diretas ou desativar duplicidade.

**Prioridade:** Média.
**Esforço:** Baixo.

### Médio — `localStorage` para UTMs sem consentimento granular

**Descrição:** `/js/tracking.js` salva UTMs e parâmetros próprios em `localStorage`.

**Risco:** Embora não salve nome/e-mail/telefone, ainda é persistência de dados de navegação/marketing.

**Evidência:** `/js/tracking.js`.

**Recomendação:** Explicar na política/cookies e futuramente condicionar persistência de marketing ao consentimento, ou limitar retenção.

**Prioridade:** Média.
**Esforço:** Médio.

### Baixo — `js/analytics.js` contém IDs de exemplo

**Descrição:** O arquivo contém `G-XXXXXXXXXX` comentado e Meta Pixel `123456789`. Não parece carregado nos HTMLs atuais, mas pode confundir manutenção futura.

**Risco:** Instalação acidental de pixel errado se o arquivo for incluído depois.

**Evidência:** `/js/analytics.js`.

**Recomendação:** Marcar como legado ou remover em fase de limpeza, após confirmar que não é usado.

**Prioridade:** Baixa.
**Esforço:** Baixo.

### Baixo — Documentações antigas com exemplos de tokens

**Descrição:** Alguns documentos usam exemplos como `RESEND_API_KEY=re_xxxxx`. Parecem placeholders, não segredo real.

**Risco:** Pode incentivar cópia para arquivo versionado.

**Evidência:** `/README_GITHUB.md`, `/docs/SETUP.md`, `/docs/INTEGRACOES.md`.

**Recomendação:** Padronizar exemplos como `coloque_sua_api_key_aqui`, reforçando que valores reais ficam no Netlify.

**Prioridade:** Baixa.
**Esforço:** Baixo.

### Observação — `.env` local existe e não está versionado

**Descrição:** Existe `.env` local, mas ele está no `.gitignore` e não é rastreado pelo Git. O conteúdo não foi lido nesta auditoria.

**Risco:** Baixo no estado atual, desde que não seja adicionado manualmente.

**Evidência:** `.gitignore`; checagem de rastreamento sem exibir valores.

**Recomendação:** Manter `.env` fora do Git e rotacionar qualquer chave que tenha sido exposta fora do painel correto.

**Prioridade:** Manutenção.
**Esforço:** Baixo.

## 7. Checklist OWASP Aplicado

| Tema | Status | Observação |
| --- | --- | --- |
| Broken Access Control | N/A parcial | Site público; futuros webhooks exigirão validação forte. |
| Cryptographic Failures | Atenção | HTTPS depende de Netlify; HSTS ainda ausente no repo. |
| Injection | Parcial | Inputs não são renderizados no HTML, mas faltam limites e sanitização mais forte. |
| Insecure Design | Atenção | Fluxo público sem rate limit/anti-bot. |
| Security Misconfiguration | Risco alto | Headers ausentes. |
| Vulnerable Components | OK inicial | `npm audit` sem vulnerabilidades. |
| Auth/Identification Failures | N/A parcial | Não há login. Webhooks futuros precisarão segredo/assinatura. |
| Software/Data Integrity | Atenção | Scripts de terceiros diretos; CSP ainda ausente. |
| Logging/Monitoring | Parcial | Logs não expõem tokens, mas ainda não há monitoramento formal. |
| SSRF/API unsafe consumption | Baixo atual | Function chama domínios fixos; webhook futuro exigirá cuidado. |
| API4 Unrestricted Resource Consumption | Risco alto | Endpoint sem rate limit. |
| API6 Sensitive Business Flows | Risco alto | Captura de lead pode ser abusada por automação. |
| API9 Improper Inventory | Parcial | Documentação boa, mas precisa alinhar privacidade/stack. |

## 8. Checklist LGPD Aplicado

| Princípio/Ponto | Status | Observação |
| --- | --- | --- |
| Finalidade | Parcial | Formulário explica ebook e comunicações; política precisa refletir stack real. |
| Adequação | Parcial | Coleta compatível com funil; WhatsApp deve continuar opcional. |
| Necessidade | Atenção | WhatsApp é útil, mas deve estar claramente justificado. |
| Livre acesso | Parcial | E-mail de contato existe. |
| Transparência | Atenção | Cookies/pixels e operadores precisam ficar mais claros. |
| Segurança | Atenção | Headers, rate limit e anti-bot pendentes. |
| Prevenção | Atenção | Falta camada anti-abuso. |
| Não discriminação | Sem achado | Não há decisão automatizada sensível visível neste repo. |
| Responsabilização | Parcial | Docs existem; falta plano de incidente e retenção operacional. |

## 9. Tabela de Dados Pessoais

| Dado | Onde coleta | Finalidade | Enviado para | Risco | Recomendação |
| --- | --- | --- | --- | --- | --- |
| Nome | `/ebook` | Personalizar cadastro e e-mail | Brevo, Resend | Baixo/médio | Limitar tamanho e sanitizar. |
| E-mail | `/ebook` | Entregar ebook e nutrir lead | Brevo, Resend | Médio | Validar, limitar, não enviar em URL. |
| WhatsApp | `/ebook` | Relacionamento opcional | Brevo | Médio | Explicar finalidade e manter opcional no contato ativo. |
| Consentimento | `/ebook` | Registrar aceite | Brevo | Médio | Registrar data/origem futuramente. |
| UTMs | URL/formulário | Atribuição de campanha | Brevo, links internos/Eduzz | Baixo/médio | Não incluir dados pessoais em UTMs. |
| Origem/campanha/página | URL/formulário | Segmentação e análise | Brevo | Baixo | Limitar tamanho e padronizar valores. |
| Cookies/pixels | Todos os HTMLs | Analytics/marketing | Google, Meta | Médio/alto | Consent Mode e banner futuro. |
| Dados de pagamento | Eduzz | Compra | Eduzz | Alto se internalizado | Manter fora da infraestrutura própria. |

## 10. Headers Recomendados

Implementar em fase de correção, preferencialmente em `_headers`:

```text
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
  X-Frame-Options: DENY
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.facebook.com https://connect.facebook.net https://api.resend.com https://api.brevo.com https://chk.eduzz.com https://checkout.eduzz.com; frame-src https://www.googletagmanager.com https://chk.eduzz.com https://checkout.eduzz.com; form-action 'self' https://chk.eduzz.com https://checkout.eduzz.com
```

Observação: essa CSP é ponto de partida moderado. Deve ser testada com Tag Assistant, Meta Pixel Helper, GTM Preview, checkout Eduzz e Netlify Dev antes de produção.

## 11. Auditoria da Function `captura-ebook`

Pontos positivos:

- Aceita apenas `POST`.
- Retorna 405 para métodos diferentes.
- Usa `try/catch`.
- Valida campos obrigatórios.
- Valida formato básico de e-mail.
- Normaliza e-mail e WhatsApp.
- Usa `process.env`.
- Não retorna mensagens técnicas ao front-end.
- Chama Brevo antes do Resend.
- Trata falhas de Brevo/Resend com logs técnicos sem tokens.

Pontos pendentes:

- Não limita tamanho do body.
- Não limita tamanho dos campos.
- Não valida `Content-Type`.
- Não tem rate limit.
- Não tem honeypot/timestamp.
- `JSON.parse` inválido cai em 500, não 400.
- Não registra timestamp explícito de consentimento no Brevo.
- Não mascara e-mail/telefone em cenários de log futuro.

## 12. Cookies, Pixels e Consentimento

Status atual:

- GTM, GA4 e Meta Pixel instalados em todos os HTMLs.
- `PageView` e `page_view` disparam automaticamente.
- Eventos de funil estão em `/js/tracking.js`.
- UTMs são salvas em `localStorage`.
- Não há banner de cookies.
- Não há Consent Mode v2 configurado no código.

Recomendação:

1. No curto prazo, documentar explicitamente cookies/pixels/localStorage na política.
2. Antes de mídia paga em escala, implementar banner com categorias:
   - essenciais;
   - analytics;
   - marketing.
3. Configurar Consent Mode v2 pelo GTM.
4. Evitar disparar Meta Pixel antes de consentimento de marketing, se a estratégia jurídica exigir.

## 13. UTMs e Parâmetros

Status atual:

- `/js/tracking.js` captura `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `origem`, `campanha`, `pagina`, `status_funil`.
- Os dados são salvos em `localStorage`.
- Hidden fields existem em `/ebook/index.html`.
- Links para `/quiz`, `/quiz-mpi` e Eduzz recebem UTMs.
- A Function envia UTMs para Brevo.
- O e-mail Resend inclui link para `/quiz-mpi` com UTMs.

Recomendação:

- Não inserir nome, e-mail ou telefone em URL.
- Limitar tamanho das UTMs.
- Definir retenção de UTMs em `localStorage`, por exemplo 30 ou 90 dias.

## 14. Eduzz e Webhook Futuro

Não foi encontrado webhook Eduzz neste repositório.

Desenho recomendado:

```text
Eduzz
 ↓
/.netlify/functions/eduzz-webhook
 ↓
Valida assinatura/token
 ↓
Confirma status da compra
 ↓
Atualiza Brevo: STATUS_FUNIL = comprou_quiz
 ↓
Opcional futuro: Meta CAPI / GA4 Measurement Protocol
```

Regras:

- Aceitar apenas `POST`.
- Validar segredo/assinatura.
- Não confiar em query string.
- Proteger contra replay, se possível.
- Não registrar payload completo com dados pessoais.

## 15. Dependências

`package.json`:

```json
{
  "type": "commonjs",
  "dependencies": {
    "resend": "^4.0.0"
  }
}
```

Resultado de `npm audit --audit-level=moderate --json`:

- Vulnerabilidades críticas: 0
- Altas: 0
- Moderadas: 0
- Baixas: 0
- Total: 0

Observação: a Function usa `fetch` direto para Resend e Brevo. O SDK `resend` está instalado como preparação futura, mas não é usado no código atual.

## 16. Logs e Monitoramento

Pontos positivos:

- Logs da Function não imprimem tokens.
- Erros enviados ao usuário são genéricos.

Pontos pendentes:

- Não há monitoramento formal de falhas.
- Não há política operacional de retenção de logs.
- Não há checklist de incidente no repo principal.

Recomendações:

- Mascarar e-mail/telefone se forem adicionados a logs futuros.
- Criar rotina de revisão dos logs da Netlify.
- Documentar resposta a incidente: identificar, conter, rotacionar, comunicar, corrigir.

## 17. Backup e Recuperação

Estado atual:

- GitHub versiona o projeto.
- Netlify mantém histórico de deploys.
- Brevo armazena contatos.
- Eduzz mantém histórico comercial.

Recomendações:

- Habilitar 2FA em Netlify, GitHub, Brevo, Resend, Eduzz, Meta, Google e registrador de domínio.
- Exportar contatos Brevo periodicamente.
- Documentar recuperação de DNS/domínio.
- Manter lista de variáveis críticas sem valores, apenas nomes e onde configurar.

## 18. Plano de Correção em Fases

### Agora

1. Criar headers de segurança.
2. Adicionar limites de campo/body na Function.
3. Adicionar honeypot e timestamp no formulário.
4. Ajustar `JSON.parse` inválido para retornar 400.
5. Revisar política de privacidade para stack atual.
6. Garantir que `.env` continue fora do Git.

### Antes de Tráfego Pago

1. Banner de cookies.
2. Consent Mode v2.
3. Revisão de disparos Meta/GA4 via GTM.
4. Teste completo com Tag Assistant, Pixel Helper e DebugView.
5. Confirmar 2FA em todas as contas críticas.

### Antes de Escalar

1. Rate limit real com storage externo.
2. Webhook Eduzz seguro.
3. Monitoramento de falhas.
4. Processo formal de resposta a incidentes.
5. Rotina de export/backup Brevo.

### Futuro

1. Meta Conversions API.
2. GA4 Measurement Protocol.
3. Server-side tagging.
4. Identificador opaco de lead, sem dados pessoais em URL.
5. Revisão jurídica final.

## 19. Pendências de Revisão Jurídica

- Texto final da política de privacidade.
- Base legal para WhatsApp e comunicações de marketing.
- Política de cookies e categorias de consentimento.
- Retenção de dados em Brevo/Resend/Eduzz/Netlify.
- Contratos/DPA com operadores.
- Fluxo de revogação e exclusão de dados.

## 20. Pendências em Painéis Externos

### Netlify

- Configurar headers após implementação.
- Verificar variáveis por escopo: Builds, Functions e Runtime.
- Revisar logs da Function.

### Vercel

- Confirmar HTTPS, domínio, variáveis e headers do quiz externo.
- Confirmar eventos `quiz_start`, `quiz_complete`, `quiz_result_view`.

### Brevo

- Confirmar atributos customizados.
- Confirmar listas.
- Confirmar opt-out e descadastro.
- Confirmar 2FA.

### Resend

- Confirmar domínio autenticado, SPF/DKIM/DMARC.
- Confirmar 2FA.
- Monitorar reputação.

### Eduzz

- Confirmar 2FA.
- Confirmar pixels no checkout.
- Planejar webhook com validação.

### Meta e Google

- Validar eventos em ambiente real.
- Configurar Consent Mode v2 quando houver banner.
- Evitar duplicidade se migrar tags para GTM.

### GitHub

- Confirmar 2FA.
- Revisar colaboradores e permissões.
- Ativar secret scanning se disponível.

## 21. Próximos Prompts Sugeridos

### Correções de baixo risco

```text
Com base em /docs/AUDITORIA_SEGURANCA_LGPD.md, aplique apenas as correções de baixo risco e alta prioridade: headers de segurança, limites server-side, honeypot, timestamp anti-bot, parse JSON 400 e atualização documental. Não faça git add, commit ou push.
```

### Revisão de política

```text
Atualize /politica-de-privacidade/index.html para refletir a stack atual: Netlify, Brevo, Resend, Eduzz, Google, Meta, Vercel e GitHub. Remova ou marque como não ativas ferramentas antigas como Hotmart, SendGrid, Supabase e Google Sheets, sem alterar o layout.
```

### Webhook Eduzz

```text
Proponha o desenho técnico do webhook Eduzz em Netlify Functions, com validação de assinatura/token, proteção contra replay e atualização segura do Brevo. Não implemente ainda.
```

### Cookies e Consent Mode

```text
Desenhe uma implementação de banner de cookies e Google Consent Mode v2 compatível com GTM, GA4 e Meta Pixel, sem implementar código ainda.
```

## 22. Conclusão

O funil está pronto para testes controlados, mas ainda não está maduro para escala de tráfego sem camadas adicionais de segurança, consentimento e proteção contra abuso. O foco imediato deve ser reduzir risco operacional: headers, validação forte, anti-bot simples, atualização da política e consentimento de cookies.

Pagamento deve continuar na Eduzz. Dados de relacionamento devem continuar no Brevo. O site deve coletar apenas o necessário para conduzir o funil.

## Correções aplicadas — Fase 1

Data da correção: 2026-05-12

### Arquivos alterados

- `/_headers`
- `/ebook/index.html`
- `/netlify/functions/captura-ebook.js`
- `/docs/AUDITORIA_SEGURANCA_LGPD.md`
- `/docs/SEGURANCA.md`

### Correções aplicadas

- Criado arquivo `/_headers` com headers iniciais para todas as rotas:
  - `Strict-Transport-Security`
  - `X-Content-Type-Options`
  - `Referrer-Policy`
  - `Permissions-Policy`
  - `X-Frame-Options`
  - `Content-Security-Policy`
- A Function `captura-ebook.js` agora:
  - aceita apenas `POST`;
  - exige `Content-Type: application/json`;
  - bloqueia body acima de 10 KB com status `413`;
  - retorna `400` para JSON inválido;
  - aplica limites máximos para campos obrigatórios e opcionais;
  - remove tags HTML simples dos campos de texto;
  - normaliza e-mail e WhatsApp;
  - bloqueia submissões suspeitas por honeypot ou tempo mínimo;
  - mantém mensagens técnicas fora da resposta ao usuário.
- O formulário de `/ebook/index.html` agora possui:
  - campo honeypot `website`;
  - campo hidden `form_started_at`;
  - preenchimento automático de `form_started_at` com `Date.now()`.
- Logs foram revisados para não registrar payload completo, tokens, API keys, nome completo, e-mail completo ou telefone completo.

### Limites definidos

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

### Pendências restantes

- Testar CSP em produção com Google Tag Assistant, Meta Pixel Helper, GTM Preview, GA4 DebugView e fluxo Eduzz.
- Implementar banner de cookies.
- Implementar Google Consent Mode v2.
- Implementar rate limit real com storage externo, se houver abuso.
- Criar webhook Eduzz seguro para confirmação real de compra.
- Atualizar política de privacidade para refletir a stack atual.
- Revisar headers também no quiz externo hospedado na Vercel.
