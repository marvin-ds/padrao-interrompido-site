# Rastreamento do Site

Este documento define o padrão de rastreamento do projeto Padrão Interrompido™ para páginas HTML atuais e futuras.

## IDs Oficiais

- Google Tag Manager: `GTM-TCW949NK`
- Google Analytics 4: `G-QJ7PW4HBRQ`
- Meta Pixel: `541342531532855`

## Tags Base

Todos os HTMLs existentes devem conter:

- Google Tag Manager no `<head>`, logo após a abertura de `<head>`.
- Google Analytics 4 no `<head>`, logo após o Google Tag Manager.
- Meta Pixel no `<head>`, logo após o Google Analytics 4.
- Google Tag Manager noscript imediatamente após a abertura de `<body>`.
- Helper global `/js/tracking.js` antes do fechamento de `</body>`.

Antes de inserir tags em novas páginas, verificar se a página já contém:

- `GTM-TCW949NK`
- `G-QJ7PW4HBRQ`
- `541342531532855`
- `/js/tracking.js`

Se já existir, não duplicar. Se houver IDs diferentes, registrar para revisão manual.

## Páginas Atualizadas

- `/TEMPLATE-BASE.html`
- `/index.html`
- `/home/index.html`
- `/ebook/index.html`
- `/ebook/obrigado.html`
- `/quiz/index.html`
- `/quiz-mpi/index.html`
- `/politica-de-privacidade/index.html`
- `/termos-de-uso/index.html`

## Helper Global

O arquivo `/js/tracking.js` expõe:

```js
trackEvent(eventName, payload = {})
trackMeta(eventName, payload = {})
trackMetaCustom(eventName, payload = {})
trackFunnelEvent(eventName, payload = {}, metaEventName = null, metaCustom = false)
trackAndNavigate(event, url, trackingCallback)
getPadraoInterrompidoTracking()
```

O helper envia eventos para `window.dataLayer`, GA4 via `gtag`, e Meta Pixel via `fbq` quando essas APIs estão disponíveis.

## Eventos Automáticos

- GA4: `page_view`
- Meta Pixel: `PageView`

Esses eventos vêm das tags base.

## Eventos Implementados

- `generate_lead`: dispara em `/ebook/index.html` somente após resposta bem-sucedida da Function de captura.
- `view_ebook_thank_you`: dispara ao abrir `/ebook/obrigado.html`.
- `click_quiz_mpi`: dispara ao clicar para `/quiz-mpi` a partir da página de obrigado.
- `view_quiz_offer`: dispara ao abrir `/quiz`.
- `view_quiz_mpi_offer`: dispara ao abrir `/quiz-mpi`.
- `begin_checkout`: dispara ao clicar nos links de checkout Eduzz em `/quiz` e `/quiz-mpi`.

## Eventos Meta Pixel

- `Lead`: junto com `generate_lead`.
- `ViewContent`: nas páginas de obrigado e ofertas.
- `InitiateCheckout`: nos cliques para checkout Eduzz.
- `ClickQuizMPI`: evento customizado no clique da página de obrigado para `/quiz-mpi`.

## Eventos que Dependem da Eduzz

Eventos de compra devem ser confirmados por evento real da Eduzz:

- Meta Pixel: `Purchase`
- GA4: `purchase`

Recomendação futura: `Webhook Eduzz → Netlify Function → Brevo + Meta CAPI + GA4 Measurement Protocol`.

## Campos UTM

O helper captura e persiste em `localStorage` na chave `padrao_interrompido_tracking`:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

## Parâmetros Próprios

Também são capturados/persistidos:

- `origem`
- `campanha`
- `pagina`
- `status_funil`

Valores padrão de `origem`:

- `/ebook`: `ebook`
- `/quiz`: `quiz_frio`
- `/quiz-mpi`: `quiz_mpi`
- `/ebook/obrigado.html`: `ebook_obrigado`

O campo `pagina` usa `window.location.pathname` quando não vier da URL.

## Propagação de UTMs

O helper propaga UTMs e parâmetros próprios para links relevantes:

- `/quiz`
- `/quiz-mpi`
- checkout Eduzz (`chk.eduzz.com` e `checkout.eduzz.com`)
- páginas internas importantes do funil

Não propagar automaticamente para:

- PDFs
- WhatsApp
- e-mail
- anchors internos com `#`

## Brevo

A Function `/.netlify/functions/captura-ebook` recebe e tenta enviar ao Brevo:

- `UTM_SOURCE`
- `UTM_MEDIUM`
- `UTM_CAMPAIGN`
- `UTM_CONTENT`
- `UTM_TERM`
- `ORIGEM`
- `CAMPANHA`
- `PAGINA`
- `STATUS_FUNIL = baixou_ebook`

Os atributos correspondentes devem existir no Brevo para que sejam gravados.

## Link do E-mail Transacional

O CTA para o Quiz de Mapeamento no e-mail transacional deve usar UTMs:

```text
/quiz-mpi?utm_source=resend&utm_medium=email&utm_campaign=entrega_ebook&utm_content=cta_quiz&origem=ebook
```

No código, a Function preserva `QUIZ_EBOOK_URL` quando existir e completa parâmetros ausentes.

## Checklist de Teste

- Google Tag Assistant.
- Meta Pixel Helper.
- GTM Preview.
- GA4 DebugView.
- Teste real do formulário do ebook.
- Verificar se `generate_lead` dispara somente após sucesso da Function.
- Verificar se o lead chega ao Brevo.
- Verificar se UTMs chegam ao Brevo.
- Clicar para `/quiz-mpi` a partir da página de obrigado.
- Clicar para checkout Eduzz a partir de `/quiz` e `/quiz-mpi`.
- Confirmar se Eduzz preserva UTMs no checkout.
