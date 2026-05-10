# Funil Ebook → Quiz → Agentes de WhatsApp

## 1. Visão Geral

Este documento orienta a implementação técnica e estratégica do funil que começa na captura do ebook gratuito, passa pela nutrição do lead, apresenta o quiz pago de R$17 e conecta os pontos comerciais com Brevo, Resend, Eduzz e agentes de WhatsApp.

O objetivo do funil é transformar interesse inicial em relacionamento organizado, entrega confiável e oferta contextual. A página `/ebook` captura nome, e-mail, WhatsApp e consentimento. Na stack mínima atual, a Netlify Function deve receber os dados, validar as informações, criar ou atualizar o contato no Brevo, disparar o envio transacional do ebook pelo Resend e retornar o redirecionamento para `/ebook/obrigado.html`.

A página de obrigado confirma a entrega, oferece o recebimento opcional pelo WhatsApp com o Agente Atendente e apresenta o quiz pago de R$17 como próximo passo natural. Leads que vieram pelo ebook devem ser direcionados para `/quiz-mpi`, enquanto tráfego frio de anúncios deve continuar indo para `/quiz`.

O princípio central da fase inicial é simples: o Brevo organiza relacionamento e nutrição, o Resend entrega mensagens transacionais, a Eduzz processa a compra e os agentes de WhatsApp devem atuar com contexto, sem transformar o primeiro contato em pressão de venda.

## Decisão Atual de Stack — Fase Inicial

Para a fase inicial do projeto, a stack mínima definida é:

- **Zoho Mail**: usado apenas como provedor de e-mail corporativo do dia a dia.
- **Resend**: usado apenas para e-mails transacionais, como envio de ebook, PDFs personalizados e mensagens técnicas.
- **Brevo**: usado para automação de e-mail marketing, campanhas, segmentação e CRM simples inicial.
- **Eduzz**: usado para checkout e processamento de compra do quiz.
- **Netlify**: usado para hospedagem do site e Netlify Functions.
- **GitHub**: usado para versionamento do projeto.

A decisão evita contratar, neste início, múltiplas ferramentas pagas do ecossistema Zoho, como Zoho CRM e Zoho Marketing Automation.

### Funil oficial atual

```text
Página de captura
 ↓
Brevo recebe o lead
 ↓
Resend envia o ebook/PDF
 ↓
Brevo nutre por e-mail
 ↓
Lead vai para /quiz-mpi
 ↓
Eduzz processa compra
 ↓
Brevo atualiza status do lead
```

### Funil expandido

```text
/ebook
 ↓
Lead preenche formulário
 ↓
Netlify Function recebe os dados
 ↓
Brevo cria/atualiza contato
 ↓
Resend envia ebook/PDF
 ↓
/ebook/obrigado.html
 ↓
Lead pode clicar para WhatsApp opcional ou para /quiz-mpi
 ↓
Brevo nutre quem ainda não comprou
 ↓
/quiz-mpi
 ↓
Checkout Eduzz
 ↓
Status de compra deve voltar para Brevo quando a integração estiver definida
```

### Papel de cada ferramenta

#### Zoho Mail

Usado apenas para e-mails corporativos do dia a dia, como:

* [contato@dominio.com](mailto:contato@dominio.com)
* [suporte@dominio.com](mailto:suporte@dominio.com)
* [atendimento@dominio.com](mailto:atendimento@dominio.com)
* [financeiro@dominio.com](mailto:financeiro@dominio.com)

Não será usado como CRM.
Não será usado como automação de campanhas.
Não será usado como disparador principal de e-mails de marketing.

#### Resend

Usado apenas para e-mails transacionais, como:

* entrega do ebook;
* envio de PDF personalizado;
* resultado do quiz;
* confirmações técnicas;
* mensagens geradas pelo sistema.

Não será usado como ferramenta de campanhas ou nutrição.

#### Brevo

Usado como ferramenta principal da fase inicial para:

* receber leads capturados;
* organizar contatos;
* segmentar leads;
* criar listas;
* criar atributos personalizados;
* disparar campanhas;
* criar automações de nutrição;
* funcionar como CRM simples inicial.

Nesta fase, o Brevo substitui a necessidade imediata de Zoho CRM e Zoho Marketing Automation.

#### Eduzz

Usado para:

* checkout do quiz;
* pagamento;
* status de compra;
* eventos comerciais;
* recuperação futura de vendas.

#### Netlify

Usado para:

* hospedar as páginas HTML;
* executar Netlify Functions;
* receber dados da página de captura;
* enviar dados para Brevo;
* acionar Resend para envio transacional.

### Mudança em relação à arquitetura anterior

A arquitetura anterior considerava:

```text
Página de captura
 ↓
Zoho CRM
 ↓
Zoho Marketing Automation
 ↓
Resend
 ↓
Eduzz
```

Essa arquitetura está pausada nesta fase inicial.

A arquitetura atual passa a ser:

```text
Página de captura
 ↓
Brevo
 ↓
Resend
 ↓
Brevo nutrição
 ↓
Eduzz
```

Motivo da mudança:

* reduzir custo inicial;
* evitar contratar múltiplas ferramentas separadas;
* simplificar implementação;
* validar o funil antes de investir em CRM mais robusto;
* manter Resend para o que ele já faz bem: transacional;
* manter Zoho Mail apenas para e-mail corporativo.

### Regras atuais de implementação

A partir desta decisão:

1. Novas integrações de leads devem priorizar Brevo, não Zoho CRM.
2. A Netlify Function de captura deve futuramente criar/atualizar contato no Brevo.
3. Resend continua enviando o ebook/PDF.
4. Brevo deve cuidar das automações de nutrição.
5. Zoho Mail não deve ser usado em automações de marketing.
6. Zoho CRM não deve ser implementado agora, salvo decisão futura.
7. Zoho Marketing Automation não deve ser implementado agora, salvo decisão futura.
8. Qualquer documentação antiga sobre Zoho CRM deve ser marcada como abordagem anterior/pausada.

### CRM nesta fase

Nesta fase, CRM completo não é obrigatório.

O necessário agora é uma base simples e organizada de leads dentro do Brevo, com dados como:

* nome;
* e-mail;
* WhatsApp;
* origem;
* campanha;
* página de captura;
* baixou ebook;
* clicou no quiz;
* comprou quiz;
* status do lead;
* data de entrada;
* última ação conhecida.

O Brevo deve ser tratado como CRM simples inicial.

Um CRM mais robusto poderá ser considerado depois, quando houver:

* maior volume de leads;
* equipe comercial;
* pipeline manual;
* necessidade de histórico comercial avançado;
* múltiplos produtos;
* necessidade de relatórios mais sofisticados.

### Campos/atributos sugeridos no Brevo

```text
NOME
EMAIL
WHATSAPP
ORIGEM
CAMPANHA
PAGINA_CAPTURA
STATUS_LEAD
BAIXOU_EBOOK
CLICOU_QUIZ
COMPROU_QUIZ
PRODUTO_INTERESSE
DATA_ENTRADA
ULTIMA_ACAO
```

Listas sugeridas:

```text
Leads - Ebook
Leads - Quiz Interesse
Clientes - Quiz
Nutrição - Ebook
Recuperação - Quiz
```

Status sugeridos:

```text
novo_lead
ebook_enviado
em_nutricao
clicou_quiz
checkout_iniciado
comprou_quiz
recuperacao
cliente
```

## 2. Arquitetura do Projeto

O projeto é um site HTML estático hospedado no Netlify e sincronizado com GitHub. A estrutura deve continuar simples, previsível e segura para deploy contínuo.

`/ebook` concentra a página de captura do ebook gratuito e a página de obrigado. A captura coleta os dados do lead; a página de obrigado confirma a entrega, abre a conversa opcional via WhatsApp e conduz para o quiz de R$17.

`/ebook/obrigado.html` é a página exibida após o cadastro bem-sucedido. Ela não deve ser acessada como substituta da captura, mas como etapa posterior ao envio dos dados para a Function.

`/quiz` é a página de venda para público frio vindo diretamente de anúncio. Ela precisa explicar mais, provar mais e reduzir objeções para pessoas que ainda não passaram pelo ebook.

`/quiz-mpi` é a página de venda para leads que vieram do ebook. O tom pode ser mais íntimo, com continuidade da promessa do material gratuito.

`/docs` guarda documentação estratégica, técnica e operacional do projeto.

`/js` guarda scripts front-end, incluindo o script da captura do ebook e comportamentos da página de obrigado.

`/netlify/functions` guarda serverless functions do Netlify. Na stack mínima atual, a Function `captura-ebook.js` deve centralizar integrações sensíveis com Brevo e Resend.

`/css` guarda estilos do site. Ajustes visuais devem seguir a identidade já existente do projeto.

`/assets` guarda imagens, arquivos visuais e materiais auxiliares.

Estrutura esperada:

```text
/ebook
  index.html
  obrigado.html

/quiz
  index.html

/quiz-mpi
  index.html

/js
  ebook-captura.js

/netlify
  /functions
    captura-ebook.js

/docs
  FUNIL_EBOOK_QUIZ_AGENTES.md
```

## 3. Mapa Estratégico do Funil

Fluxo principal para captura do ebook:

```text
Tráfego / Conteúdo / Anúncio
        ↓
/ebook
        ↓
Captura: nome, e-mail e WhatsApp
        ↓
Netlify Function
        ↓
Brevo
        ↓
Resend envia ebook
        ↓
/ebook/obrigado.html
        ↓
WhatsApp Atendente opcional
        ↓
/quiz-mpi
        ↓
Checkout Eduzz
        ↓
Agente Vendedor / Recuperação
```

Fluxo para tráfego frio direto:

```text
Anúncio direto para quiz
        ↓
/quiz
        ↓
Checkout Eduzz
        ↓
Agente Vendedor / Recuperação
```

A separação entre `/quiz` e `/quiz-mpi` é estratégica. O lead que chegou pelo ebook já demonstrou interesse, já entregou dados e já recebeu uma promessa de valor. Por isso, a oferta do quiz deve parecer continuidade, não uma interrupção. O público frio precisa de mais contexto, prova, explicação e segurança antes de comprar.

## 4. Papel de Cada Ferramenta

### Netlify

O Netlify é responsável pela hospedagem do site, deploy contínuo a partir do GitHub e execução das serverless functions. No funil, ele cumpre dois papéis principais: publicar as páginas estáticas e executar a Function `captura-ebook.js`.

A Function deve ser usada para tudo que envolve credenciais, chamadas autenticadas e lógica sensível. O front-end nunca deve conversar diretamente com Zoho CRM ou Resend usando chaves privadas.

### GitHub

O GitHub é a fonte de versionamento do projeto. Toda mudança estrutural, visual ou técnica deve ser commitada e rastreável. Ele permite revisar alterações, reverter problemas e manter histórico claro da evolução do funil.

Arquivos com credenciais reais, tokens, chaves de API ou segredos não devem ser commitados. As variáveis sensíveis pertencem ao painel do Netlify ou ao gerenciador seguro definido pela operação.

### Zoho CRM

O Zoho CRM deve ser a base principal dos leads. Ele organiza o histórico do contato, origem, consentimento, etapa do funil, interesse, tags e relação com o produto ofertado.

Quando alguém baixa o ebook, o lead deve ser criado ou atualizado no Zoho antes do redirecionamento para a página de obrigado. Isso preserva o dado mesmo se o envio de e-mail atrasar ou se o usuário fechar a página.

### Zoho Marketing Automation

O Zoho Marketing Automation deve cuidar das jornadas de nutrição. Ele usa os dados do CRM para segmentar leads, enviar sequências educativas, pausar ofertas quando alguém compra e criar réguas com base no comportamento.

A nutrição deve partir do CRM porque o CRM é a base confiável. A automação deve herdar dados, tags e campos de estágio para decidir quem recebe qual comunicação.

### Resend

O Resend deve ser usado para envio transacional do ebook. Ele é adequado para disparos diretos, rápidos e acionados por evento, como “lead preencheu formulário e precisa receber o material”.

O envio deve preferir link para download ou leitura do ebook em vez de anexo pesado. Isso melhora entregabilidade, rastreabilidade e manutenção do material.

### Eduzz

A Eduzz deve ser usada para checkout, pagamento, produto quiz de R$17 e eventos comerciais. Ela é a camada de transação, intenção e compra.

A Eduzz não deve virar o CRM principal do funil. Ela informa eventos comerciais importantes, mas a visão de relacionamento deve continuar no Zoho.

### WhatsApp Agents

Os agentes de WhatsApp devem atuar de acordo com o contexto do lead. O Agente Atendente entra no topo e meio do funil, especialmente para quem pediu o ebook no WhatsApp. O Agente Vendedor entra quando há intenção comercial. O Agente de Recuperação entra em abandono, Pix pendente, boleto não pago ou cartão recusado.

Como os agentes ficam em números diferentes e não há roteamento interno por setor no mesmo número, cada link e evento deve apontar para o número correto.

## 5. Regras de Ouro do Funil

- Não usar a Eduzz como CRM principal.
- Não obrigar o WhatsApp para baixar o ebook.
- Não colocar o vendedor no primeiro contato do ebook.
- Não vender agressivamente o quiz antes da entrega do ebook.
- Sempre salvar o lead no Zoho antes de qualquer redirecionamento.
- Sempre usar UTMs nos links para `/quiz`, `/quiz-mpi` e checkout Eduzz.
- Separar tráfego frio de lead aquecido.
- Usar o WhatsApp como acolhimento, não como pressão.
- Não colocar API keys no front-end.
- Não misturar jornadas de nutrição com eventos comerciais sem critério.
- Não tratar todos os leads como prontos para compra.
- Não enviar comunicações sem consentimento adequado.

## 6. Página `/ebook`

A página `/ebook` tem a missão de capturar leads interessados no ebook gratuito. Ela deve ser clara, direta e confiável, com formulário simples e consentimento explícito.

Objetivos da página:

- Capturar nome, e-mail e WhatsApp.
- Exigir consentimento.
- Enviar os dados para `/.netlify/functions/captura-ebook`.
- Não redirecionar antes de receber sucesso da Function.
- Exibir erro amigável se a captura falhar.
- Manter o WhatsApp como dado de relacionamento, não como barreira agressiva.

Campos obrigatórios:

- `nome`
- `email`
- `whatsapp`
- `consentimento`

Campos ocultos sugeridos:

- `origem`
- `campanha`
- `pagina`

Exemplo:

```html
<input type="hidden" name="origem" value="Página Ebook">
<input type="hidden" name="campanha" value="ebook_gratuito">
<input type="hidden" name="pagina" value="/ebook">
```

O front-end deve enviar esses campos para a Netlify Function usando `fetch`. Durante o envio, o botão deve indicar carregamento e evitar múltiplos envios. O redirecionamento para `/ebook/obrigado.html` deve acontecer somente quando a Function retornar sucesso.

## 7. Netlify Function `captura-ebook.js`

A Function `captura-ebook.js` é o ponto seguro de integração entre o site estático, Zoho CRM e Resend. Ela deve receber os dados do formulário, validar a entrada e executar integrações privadas sem expor credenciais no navegador.

Responsabilidades:

1. Receber os dados do formulário.
2. Validar campos obrigatórios.
3. Normalizar e-mail e WhatsApp.
4. Gerar access token do Zoho via refresh token.
5. Criar ou atualizar lead no Zoho CRM usando upsert.
6. Enviar o ebook pelo Resend.
7. Retornar JSON com sucesso e redirecionamento para `/ebook/obrigado.html`.

Variáveis de ambiente necessárias:

```text
RESEND_API_KEY
RESEND_FROM
ZOHO_CLIENT_ID
ZOHO_CLIENT_SECRET
ZOHO_REFRESH_TOKEN
ZOHO_ACCOUNTS_URL
ZOHO_API_DOMAIN
EBOOK_URL
WHATSAPP_ATENDENTE
QUIZ_EBOOK_URL
QUIZ_FRIO_URL
```

Nenhuma chave deve ser colocada no código, no HTML, em arquivos JavaScript públicos ou em commits no GitHub. As variáveis devem ser configuradas no painel do Netlify.

O retorno esperado em caso de sucesso deve incluir uma indicação clara de redirecionamento:

```json
{
  "success": true,
  "redirect": "/ebook/obrigado.html"
}
```

O retorno em caso de erro deve ser amigável, sem expor detalhes internos da integração:

```json
{
  "success": false,
  "message": "Erro interno ao processar cadastro."
}
```

## 8. Zoho CRM

> Nota: Esta abordagem foi considerada anteriormente, mas foi pausada na fase inicial por custo e complexidade. A stack atual usa Brevo como CRM simples e automação.

O Zoho CRM deve ser tratado como a base principal dos leads. Tudo que for relevante para relacionamento, segmentação e acompanhamento deve ser salvo nele: origem, consentimento, produto de interesse, etapa do funil, comportamento e compra.

Campos sugeridos:

- `First_Name`
- `Last_Name`
- `Email`
- `Mobile`
- `Lead_Source`
- `Company`
- `Description`
- `Etapa_do_Funil`
- `Interesse`
- `Origem_da_Captura`
- `Campanha`
- `Consentimento_LGPD`
- `Produto_Ofertado`
- `Comprou_Quiz`
- `Origem_do_Quiz`

Tags sugeridas:

- `ebook_baixado`
- `lead_ebook`
- `whatsapp_informado`
- `quiz_ofertado`
- `quiz_clicado`
- `quiz_comprado`
- `lead_quente`
- `lead_morno`
- `recuperacao`

Os API Names reais do Zoho devem ser conferidos antes da implementação. O nome exibido no painel nem sempre é o mesmo nome usado pela API.

A criação ou atualização do lead deve preferir upsert por e-mail. Isso evita duplicidade em cadastros repetidos e permite enriquecer um lead já existente com novas tags, origem ou etapa do funil.

## 9. Zoho Marketing Automation

> Nota: Esta abordagem foi considerada anteriormente, mas foi pausada na fase inicial por custo e complexidade. A stack atual usa Brevo como CRM simples e automação.

A nutrição deve partir do Zoho CRM. O Marketing Automation deve receber leads segmentados por campos e tags, não por listas manuais soltas.

Jornada sugerida:

- D0: entrega e boas-vindas.
- D1: dor principal.
- D2: história ou identificação.
- D3: convite suave para o quiz de R$17.
- D5: quebra de objeção.
- D7: último convite leve.
- D10: conteúdo de valor sem pressão.

Exemplos de assuntos:

- "Seu ebook chegou — comece por essa parte"
- "O erro não é falta de força. É falta de diagnóstico."
- "O ebook mostra o mapa. O quiz mostra onde você está."
- "Antes de tentar mais uma vez no escuro..."

A automação deve parar ou mudar de trilha quando o lead comprar o quiz. Um comprador não deve continuar recebendo mensagens de venda do mesmo produto.

## 10. Resend

O Resend deve ser usado para envio transacional do ebook logo após o cadastro. Esse envio não substitui a nutrição, que deve ficar no Zoho Marketing Automation.

Boas práticas:

- Enviar link do ebook em vez de anexo.
- Usar domínio autenticado.
- Configurar SPF, DKIM e, se possível, DMARC.
- Usar remetente consistente, como `contato@seudominio.com.br`.
- Incluir tags de envio para rastreio.
- Evitar linguagem exageradamente promocional no e-mail de entrega.
- Manter o corpo do e-mail limpo, objetivo e útil.

Estrutura sugerida de e-mail:

- Saudação com o nome do lead.
- Link do ebook.
- Orientação de leitura.
- Ponte suave para o quiz.
- Assinatura.

Exemplo de conteúdo:

```text
Assunto: Seu ebook chegou — comece por essa parte

Oi, NOME.

Aqui está o link para acessar seu ebook:
EBOOK_URL

Minha sugestão: leia primeiro a introdução e marque os trechos que mais parecem falar sobre o seu momento atual.

Depois, se quiser entender melhor onde você está no processo, o quiz diagnóstico de R$17 pode te mostrar seu ponto de partida.

Abraço,
ASSINATURA
```

## 11. Página `/ebook/obrigado.html`

A página de obrigado tem três funções:

1. Confirmar que o ebook foi enviado.
2. Oferecer WhatsApp opcional.
3. Oferecer quiz de R$17 como próximo passo.

Texto estratégico sugerido:

```text
Seu ebook está chegando no seu e-mail. Quer receber também pelo WhatsApp?
```

Mensagem sugerida para botão do WhatsApp:

```text
Oi, acabei de me cadastrar para receber o ebook gratuito. Pode me enviar por aqui também?
```

Link sugerido:

```text
https://wa.me/NUMERO_DO_ATENDENTE?text=MENSAGEM_CODIFICADA
```

CTA do quiz:

```text
Fazer o quiz diagnóstico por R$17
```

Link:

```text
/quiz-mpi/?utm_source=ebook&utm_medium=obrigado&utm_campaign=quiz_17
```

O WhatsApp deve ser opcional. A pessoa já deve ter recebido ou estar prestes a receber o ebook por e-mail. O botão do WhatsApp deve funcionar como reforço, atendimento e acolhimento.

## 12. Página `/quiz-mpi`

A página `/quiz-mpi` é destinada ao lead aquecido vindo do ebook. Ela não precisa recomeçar a conversa do zero. Deve conectar diretamente com a promessa do ebook e mostrar que o quiz é o próximo passo lógico.

Tom recomendado:

- Mais íntimo.
- Continuidade do ebook.
- Menos agressivo.
- Mostrar que o quiz é o próximo passo natural.
- Reforçar diagnóstico, clareza e ponto de partida.

Mensagem estratégica:

```text
O ebook te mostra o caminho geral. O quiz mostra o seu ponto de partida.
```

Checkout Eduzz com UTM:

```text
https://checkout.eduzz.com/SEU-CHECKOUT?utm_source=ebook&utm_medium=quiz_mpi&utm_campaign=quiz_17
```

Essa página deve evitar parecer uma oferta desconectada. O lead precisa sentir que está avançando no mesmo raciocínio iniciado pelo ebook.

## 13. Página `/quiz`

A página `/quiz` é destinada ao público frio vindo diretamente de anúncios. Esse público ainda não recebeu o ebook, não conhece necessariamente a lógica da metodologia e precisa de mais explicação.

Tom recomendado:

- Promessa mais clara e direta.
- Mais explicação.
- Mais prova.
- Mais FAQ.
- Mais quebra de objeções.
- Mais contexto sobre o problema e o valor do diagnóstico.

Checkout Eduzz com UTM:

```text
https://checkout.eduzz.com/SEU-CHECKOUT?utm_source=meta&utm_medium=quiz_frio&utm_campaign=quiz_17
```

Essa página não deve ser misturada com `/quiz-mpi`. A origem e o nível de consciência são diferentes.

## 14. Eduzz

A Eduzz deve processar a compra do quiz de R$17, registrar eventos comerciais e acionar os agentes integrados conforme o comportamento do lead.

Papel da Eduzz:

- Checkout.
- Pagamento.
- Produto quiz de R$17.
- Eventos comerciais.
- Acionamento de agentes integrados.

Eventos relevantes:

- Checkout iniciado.
- Pix pendente.
- Boleto gerado.
- Pagamento aprovado.
- Pagamento recusado.
- Compra não concluída.
- Reembolso.

A Eduzz não deve ser a base principal de leads frios. Ela deve ser entendida como a base comercial de intenção, transação e compra. O histórico de relacionamento e segmentação deve permanecer no Zoho CRM.

Sempre que possível, eventos importantes da Eduzz devem voltar para o Zoho, especialmente compra aprovada, abandono e reembolso.

## 15. Agentes de WhatsApp

Como os agentes ficam em números diferentes e não existe roteamento interno por setor dentro do mesmo número, cada etapa deve direcionar para o número correto.

### Agente Atendente

Entrada:

- Botão da página de obrigado.
- Lead que quer receber ebook no WhatsApp.
- Dúvidas iniciais.

Objetivo:

- Entregar ou reforçar o ebook.
- Acolher.
- Responder dúvidas simples.
- Convidar para o quiz de R$17 sem pressão.

Mensagem inicial sugerida:

```text
Claro! Aqui está o ebook. Depois que você ler, posso te mandar também o quiz diagnóstico de R$17 para entender melhor o seu momento.
```

O Agente Atendente não deve agir como vendedor agressivo. Ele é a primeira conversa humana ou semihumana do funil, então precisa preservar confiança.

### Agente Vendedor

Entrada:

- Lead que clicou no quiz.
- Lead que entrou na página de venda.
- Lead que demonstrou intenção.
- Eventos comerciais vindos da Eduzz.

Objetivo:

- Explicar o valor do quiz.
- Quebrar objeções.
- Ajudar na decisão.
- Conduzir o lead para o checkout quando fizer sentido.

O Agente Vendedor deve atuar quando existe sinal de intenção. Exemplos: clique no CTA do quiz, visita à página de venda, interação com oferta ou início de checkout.

### Agente Recuperação

Entrada:

- Checkout abandonado.
- Pix pendente.
- Boleto não pago.
- Cartão recusado.

Objetivo:

- Recuperar venda sem pressão.
- Ajudar com pagamento.
- Tirar dúvidas finais.
- Reduzir fricção técnica.

Mensagem sugerida:

```text
Vi que você começou o processo do quiz, mas talvez tenha ficado alguma dúvida no caminho. Quer que eu te ajude a entender se faz sentido para você agora?
```

O Agente de Recuperação deve ajudar, não constranger. O objetivo é facilitar a decisão e resolver obstáculos.

## 16. UTMs e Rastreio

As UTMs permitem entender de onde o lead veio, qual página converteu e qual jornada gerou receita. Todo link importante deve carregar UTMs consistentes.

Para página de obrigado:

```text
/quiz-mpi/?utm_source=ebook&utm_medium=obrigado&utm_campaign=quiz_17
```

Para WhatsApp:

```text
/quiz-mpi/?utm_source=whatsapp&utm_medium=agente_atendente&utm_campaign=quiz_17
```

Para anúncio direto:

```text
/quiz/?utm_source=meta&utm_medium=cpc&utm_campaign=quiz_frio
```

Para checkout vindo do ebook:

```text
utm_source=ebook
utm_medium=quiz_mpi
utm_campaign=quiz_17
```

Para checkout vindo de anúncio:

```text
utm_source=meta
utm_medium=quiz_frio
utm_campaign=quiz_17
```

Padrão recomendado:

- `utm_source`: origem principal, como `ebook`, `meta`, `whatsapp`.
- `utm_medium`: canal ou contexto, como `obrigado`, `quiz_mpi`, `cpc`.
- `utm_campaign`: campanha, como `quiz_17`.
- `utm_content`: variação opcional de criativo, botão ou teste A/B.
- `utm_term`: termo opcional para campanhas pagas.

## 17. LGPD e Consentimento

O formulário deve ter checkbox de consentimento claro. O lead precisa saber que receberá o ebook e comunicações relacionadas a conteúdos, diagnósticos e ofertas.

Orientações:

- O formulário deve ter checkbox de consentimento.
- Informar que o usuário receberá o ebook e comunicações relacionadas.
- Linkar política de privacidade.
- Não enviar mensagens sem base de consentimento.
- Permitir descadastro nas comunicações por e-mail.
- Não compartilhar dados entre ferramentas sem necessidade.
- Coletar apenas os dados necessários para o funil.
- Registrar consentimento no Zoho CRM.

Exemplo de texto:

```text
Aceito receber o ebook gratuito e comunicações relacionadas a conteúdos, diagnósticos e ofertas. Posso cancelar quando quiser.
```

O consentimento deve ser salvo como campo no Zoho CRM, com data e origem quando possível.

## 18. Passo a Passo de Implementação

### Fase 1 — Estrutura

- Confirmar `/ebook/index.html`.
- Criar `/ebook/obrigado.html`.
- Criar `/js/ebook-captura.js`.
- Criar `/netlify/functions/captura-ebook.js`.
- Confirmar `/quiz` e `/quiz-mpi`.
- Confirmar que `/docs` existe.

### Fase 2 — Netlify

- Confirmar deploy.
- Configurar variáveis de ambiente.
- Testar function localmente, se possível.
- Fazer deploy via GitHub.
- Verificar logs da Function no painel do Netlify.
- Confirmar que `/.netlify/functions/captura-ebook` responde a POST.

### Fase 3 — Resend

- Criar API Key.
- Autenticar domínio.
- Configurar remetente.
- Definir `EBOOK_URL`.
- Testar envio.
- Validar SPF, DKIM e reputação.
- Conferir se o link do ebook abre corretamente.

### Fase 4 — Zoho CRM

- Criar ou validar campos.
- Conferir API Names.
- Criar OAuth Client.
- Gerar refresh token.
- Configurar variáveis no Netlify.
- Testar upsert.
- Testar cadastro duplicado.
- Validar tags e etapa do funil.

### Fase 5 — Front-end

- Ajustar formulário do ebook.
- Garantir validação básica.
- Garantir loading no botão.
- Garantir tratamento de erro.
- Redirecionar somente após sucesso.
- Preservar UTMs de origem quando possível.
- Evitar múltiplos envios do mesmo formulário.

### Fase 6 — Obrigado e WhatsApp

- Configurar número do agente atendente.
- Configurar mensagem codificada.
- Testar abertura do WhatsApp.
- Garantir que o WhatsApp seja opcional.
- Conferir CTA para `/quiz-mpi`.
- Validar UTMs no link do quiz.

### Fase 7 — Quiz e Eduzz

- Confirmar links de checkout.
- Separar checkout ou UTMs para `/quiz` e `/quiz-mpi`.
- Testar compra real ou compra em ambiente de teste.
- Validar acionamento dos agentes.
- Conferir recebimento de eventos comerciais.
- Validar comportamento de Pix pendente, boleto e cartão recusado.

### Fase 8 — Marketing Automation

- Sincronizar Zoho CRM com Zoho Marketing Automation.
- Criar lista ou segmento de leads do ebook.
- Criar jornada de nutrição.
- Criar regra para parar nutrição quando comprar o quiz.
- Criar variações de assunto.
- Validar descadastro.
- Monitorar entregabilidade.

### Fase 9 — Testes Finais

- Testar cadastro novo.
- Testar cadastro duplicado.
- Testar e-mail inválido.
- Testar WhatsApp.
- Testar redirecionamento.
- Testar UTM.
- Testar lead no Zoho.
- Testar envio Resend.
- Testar compra Eduzz.
- Testar acionamento dos agentes.
- Testar logs de erro.
- Testar privacidade e consentimento.

## 19. Critérios de Sucesso

- Lead aparece no Zoho CRM.
- Lead não duplica em cadastros repetidos.
- Ebook chega por e-mail.
- Página de obrigado abre corretamente.
- WhatsApp abre com mensagem pronta.
- Link do quiz leva para `/quiz-mpi`.
- Página `/quiz` continua funcionando para tráfego frio.
- Checkout Eduzz recebe UTMs.
- Agentes são acionados nos eventos corretos.
- Lead comprador sai da nutrição de venda do quiz.
- Consentimento fica registrado.
- Credenciais não aparecem no front-end ou no GitHub.
- Logs permitem diagnosticar falhas sem expor dados sensíveis.

## 20. O Que Não Fazer

- Não colocar API keys no front-end.
- Não salvar credenciais no GitHub.
- Não enviar lead direto para vendedor no primeiro contato.
- Não obrigar o lead a abrir WhatsApp para receber o ebook.
- Não misturar `/quiz` e `/quiz-mpi`.
- Não usar Eduzz como CRM principal.
- Não sobrescrever páginas existentes sem revisar.
- Não remover UTMs.
- Não ignorar LGPD.
- Não redirecionar antes de salvar o lead no Zoho.
- Não depender apenas de WhatsApp para entrega do ebook.
- Não anexar arquivos pesados no e-mail sem necessidade.
- Não criar campos no Zoho sem conferir API Names.
- Não tratar erro técnico como sucesso para o usuário.

## 21. Próximas Evoluções

- Criar endpoint de clique para registrar no Zoho quando o lead clicar no quiz.
- Criar campo de lead score.
- Criar dashboard de conversão.
- Criar integração de compra aprovada da Eduzz de volta para o Zoho.
- Criar automação para remover comprador da sequência de venda.
- Criar testes A/B de página de obrigado.
- Criar testes A/B entre `/quiz` e `/quiz-mpi`.
- Criar segmentação por origem de tráfego.
- Criar eventos no Google Analytics/Meta Pixel.
- Criar trilha diferente para leads que clicaram no WhatsApp.
- Criar trilha diferente para quem abriu o ebook, mas não clicou no quiz.
- Criar alertas internos para falhas de integração.
- Criar monitoramento de taxa de entrega do Resend.
- Criar relatório semanal de leads, cliques, checkout e compras.

## 22. Resumo Executivo

O ebook captura. O Brevo organiza e nutre. O Resend entrega. A página de obrigado abre conversa. O WhatsApp acolhe. O quiz de R$17 monetiza o interesse. A Eduzz processa a venda. Os agentes acompanham quem demonstrou intenção.

## Página de Obrigado do Ebook — Decisão Pendente

A página `/ebook/obrigado.html` deve ser tratada como uma etapa estratégica do funil, mas a lógica definitiva de WhatsApp e agentes ainda depende de decisão operacional. Ainda está em avaliação se o projeto usará uma plataforma pronta de agentes de WhatsApp, agentes próprios ou um modelo híbrido.

Quando a implementação final for definida, a página de obrigado deverá:

- Confirmar que o ebook foi enviado por e-mail.
- Oferecer WhatsApp opcional.
- Estimular o clique para `/quiz-mpi`.
- Usar a palavra “mapeamento” em vez de “diagnóstico”.
- Não destacar o preço do quiz no CTA principal.
- Evitar depender de uma plataforma específica de agentes até a decisão final.
- Posicionar o WhatsApp como continuidade e acolhimento, não como venda imediata.

Mapa planejado do funil com agentes:

```text
/ebook
 ↓
Lead preenche formulário
 ↓
Zoho CRM recebe lead
 ↓
Resend envia ebook
 ↓
/ebook/obrigado.html
 ↓
Botão opcional para WhatsApp do Atendente
 ↓
Atendente entrega o ebook e convida para o quiz
 ↓
/quiz-mpi
 ↓
Checkout Eduzz
 ↓
Agente Vendedor ou Recuperação entra pela integração com Eduzz
```

O WhatsApp não deve ser obrigatório para baixar o ebook. Ele deve ser uma opção de continuidade para quem quiser receber o material por lá ou tirar uma dúvida rápida.

Frase recomendada para a página de obrigado:

```text
Quer receber também pelo WhatsApp e tirar alguma dúvida rápida?
```

Essa frase abre conversa sem pressão comercial. Ela posiciona o atendimento como ajuda e continuidade, não como abordagem de venda imediata.

Frase a evitar:

```text
Fale com um vendedor.
```

Ainda é cedo para esse tipo de chamada, porque o lead acabou de baixar um ebook gratuito e ainda está no topo ou meio do funil.

Copy aprovada para o quiz:

```text
O quiz de mapeamento foi criado para revelar o seu ponto de partida e transformar o conteúdo do ebook em um caminho mais claro, pessoal e aplicável.
```

```text
Descobrir meu ponto de partida
```

Opções alternativas de CTA:

```text
Fazer meu mapeamento agora
```

```text
Ver meu mapeamento agora
```

```text
Mapear meu próximo passo
```

Link futuro do CTA para o quiz:

```text
/quiz-mpi/?utm_source=ebook&utm_medium=obrigado&utm_campaign=quiz_17
```

Decisão pendente sobre agentes:

1. Plataforma pronta de agentes.
2. Agentes próprios.
3. Modelo híbrido.

Nota estratégica:

```text
Recomendação atual: validar o funil com uma solução pronta ou semi-pronta antes de investir no desenvolvimento de agentes próprios. Depois que o fluxo vencedor estiver claro, avaliar se vale construir uma solução própria.
```
