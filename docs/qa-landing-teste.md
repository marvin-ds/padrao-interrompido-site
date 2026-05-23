# QA da Landing do Teste do Momento Invisível

## Checklist

- [ ] Página abre em `/teste-momento-invisivel/`.
- [ ] Primeiro CTA aponta para `https://teste.padraointerrompido.com.br`.
- [ ] Todos os CTAs apontam para o subdomínio próprio.
- [ ] Não há link público para `quiz-padrao-interrompido.vercel.app`.
- [ ] Frase de decisão foi inserida antes do CTA.
- [ ] Bloco `Como funciona` foi atualizado.
- [ ] Frase `O parcial mostra onde olhar. O completo mostra o que observar.` foi inserida.
- [ ] Bloco `Não é sobre se culpar...` foi inserido.
- [ ] Disclaimer educativo continua presente.
- [ ] Política de Privacidade e Termos continuam linkados.
- [ ] Página está responsiva no mobile.
- [ ] Página carrega rápido.
- [ ] Linguagem Ads-Safe validada.
- [ ] Subdomínio `teste.padraointerrompido.com.br` documentado.
- [ ] DNS/Vercel validado quando disponível.

## Eventos de tracking

Os CTAs da landing disparam:

- GA4/GTM/dataLayer: `quiz_start`
- Meta Pixel custom event: `QuizStarted`

Payload esperado:

```js
{
  source: "teste_momento_invisivel",
  product: "quiz_mapeamento",
  funnel_step: "quiz_entry_click",
  destination: "teste_padraointerrompido",
  page: "/teste-momento-invisivel"
}
```

## Teste manual

1. Abrir `/teste-momento-invisivel/`.
2. Conferir a primeira dobra no mobile.
3. Clicar em `Fazer o Teste gratuito`.
4. Confirmar que o destino é `https://teste.padraointerrompido.com.br`.
5. Voltar para a landing.
6. Clicar em `Começar meu Teste gratuito`.
7. Confirmar o mesmo destino.
8. Validar no Tag Assistant/Meta Pixel Helper se o clique dispara o evento.
