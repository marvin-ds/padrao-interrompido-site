# Variáveis de Ambiente

Este projeto usa variáveis de ambiente para proteger credenciais e configurar integrações externas sem expor dados sensíveis no código.

## Onde configurar em produção

As variáveis reais devem ser configuradas no painel do Netlify:

**Site configuration → Environment variables**

As Netlify Functions acessam essas variáveis usando:

```js
process.env.NOME_DA_VARIAVEL
```

## Arquivos locais

O arquivo `.env.example` existe apenas como modelo.

O arquivo `.env`, caso seja usado localmente, não deve ser enviado para o GitHub.

## Arquivos que não devem ser commitados

Os seguintes arquivos devem permanecer no `.gitignore`:

```text
.env
.env.local
.env.*.local
.netlify
node_modules
```

## Variáveis usadas no projeto

### Resend

| Variável         | Descrição                          |
| ---------------- | ---------------------------------- |
| `RESEND_API_KEY` | Chave de API do Resend.            |
| `RESEND_FROM`    | Remetente usado no envio do ebook. |

### Zoho CRM

| Variável             | Descrição                                     |
| -------------------- | --------------------------------------------- |
| `ZOHO_CLIENT_ID`     | Client ID do aplicativo OAuth do Zoho.        |
| `ZOHO_CLIENT_SECRET` | Client Secret do aplicativo OAuth do Zoho.    |
| `ZOHO_REFRESH_TOKEN` | Refresh Token usado para gerar access tokens. |
| `ZOHO_ACCOUNTS_URL`  | URL de autenticação do Zoho.                  |
| `ZOHO_API_DOMAIN`    | Domínio da API do Zoho CRM.                   |

### Ebook

| Variável    | Descrição                       |
| ----------- | ------------------------------- |
| `EBOOK_URL` | Link público do ebook gratuito. |

### WhatsApp

| Variável             | Descrição                               |
| -------------------- | --------------------------------------- |
| `WHATSAPP_ATENDENTE` | Número do agente atendente no WhatsApp. |

### Quiz

| Variável         | Descrição                                                    |
| ---------------- | ------------------------------------------------------------ |
| `QUIZ_EBOOK_URL` | URL da página `/quiz-mpi`, usada para leads vindos do ebook. |
| `QUIZ_FRIO_URL`  | URL da página `/quiz`, usada para tráfego frio de anúncios.  |

### Eduzz

| Variável                    | Descrição                                                     |
| --------------------------- | ------------------------------------------------------------- |
| `EDUZZ_CHECKOUT_QUIZ_EBOOK` | Link de checkout do quiz com UTMs para leads vindos do ebook. |
| `EDUZZ_CHECKOUT_QUIZ_FRIO`  | Link de checkout do quiz com UTMs para público frio.          |

## Boas práticas de segurança

* Nunca colocar API Keys no HTML, CSS ou JavaScript público.
* Nunca commitadar `.env` no GitHub.
* Nunca expor `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN` ou `RESEND_API_KEY` no front-end.
* Usar variáveis sensíveis apenas em Netlify Functions.
* Usar `.env.example` apenas como referência.
* Rotacionar chaves caso sejam expostas acidentalmente.
* Usar nomes claros e padronizados para facilitar manutenção.

## Observação importante

As variáveis presentes no `.env.example` são fictícias.

Os valores reais devem ser configurados manualmente no Netlify.
