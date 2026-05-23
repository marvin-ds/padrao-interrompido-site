# Rotina de apontamento do subdomínio teste.padraointerrompido.com.br

## Contexto

Subdomínio desejado:

```text
https://teste.padraointerrompido.com.br
```

App Vercel atual:

```text
https://quiz-padrao-interrompido.vercel.app
```

Objetivo: fazer `teste.padraointerrompido.com.br` apontar para o app do Quiz hospedado na Vercel, mantendo a experiência pública dentro do ambiente oficial do Padrão Interrompido.

## 1. Na Vercel

1. Acessar o projeto do Quiz na Vercel.
2. Ir em `Settings` -> `Domains`.
3. Adicionar o domínio:

```text
teste.padraointerrompido.com.br
```

4. Aguardar a Vercel informar o registro DNS necessário.
5. Normalmente, para subdomínio, a Vercel solicitará um CNAME apontando para:

```text
cname.vercel-dns.com
```

6. Copiar exatamente o valor informado pela Vercel, caso seja diferente.

## 2. No provedor DNS do domínio

1. Acessar o painel DNS do domínio `padraointerrompido.com.br`.
2. Criar um registro do tipo CNAME:

```text
Name/Host: teste
Type: CNAME
Value/Target: cname.vercel-dns.com
TTL: automático ou padrão
```

3. Salvar.
4. Aguardar propagação.

## 3. Validação

Validar:

- `https://teste.padraointerrompido.com.br` abre o Quiz;
- certificado SSL está ativo;
- não há erro de mixed content;
- a URL não redireciona para `quiz-padrao-interrompido.vercel.app`;
- os CTAs da landing apontam para `https://teste.padraointerrompido.com.br`;
- o Quiz funciona normalmente.

## 4. Observação estratégica

Netlify pode hospedar a porta de entrada.

Vercel pode hospedar o motor.

Mas a pessoa precisa sentir que está sempre dentro da mesma casa.

## 5. Fallback temporário

Se o subdomínio ainda não estiver propagado, manter temporariamente o link antigo apenas em ambiente de teste, mas não usar em campanhas pagas.

Quando o subdomínio estiver ativo, remover qualquer link público para:

```text
https://quiz-padrao-interrompido.vercel.app
```
