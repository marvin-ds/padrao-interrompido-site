# Padrões de HTML do Site

Este documento define os blocos obrigatórios para páginas HTML do projeto Padrão Interrompido™.

## Identidade e Contato

Use sempre estes dados oficiais:

- Instagram: `@marcosvinicius.mpi`
- E-mail de contato: `contato@padraointerrompido.com.br`
- Site: `padraointerrompido.com.br`

Links recomendados:

```html
<a href="https://instagram.com/marcosvinicius.mpi">@marcosvinicius.mpi</a>
<a href="mailto:contato@padraointerrompido.com.br">contato@padraointerrompido.com.br</a>
<a href="https://padraointerrompido.com.br">padraointerrompido.com.br</a>
```

## Seção de Autoridade

Páginas estratégicas devem usar a mesma seção de autoridade da página de captura do ebook, especialmente:

- Home
- Página de captura do ebook
- Página de obrigado do ebook
- Página `/quiz`
- Página `/quiz-mpi`

Conteúdo padrão:

```html
<section class="section" id="sobre">
  <div class="container max-width-container">
    <div class="authority-standard">
      <img src="/ebook/marcos-vinicius.jpg" alt="Marcos Vinicius" class="authority-standard__photo" loading="lazy">

      <h3>Quem criou o Padrão Interrompido™</h3>

      <p>Marcos Vinicius é hipnoterapeuta e criador do método <strong>Padrão Interrompido™</strong>, uma abordagem aplicada ao mapeamento de comportamentos automáticos antes da reação consciente.</p>

      <p>Seu trabalho não parte da ideia de "ter mais disciplina", mas de identificar o momento invisível onde o padrão começa a se formar.</p>

      <div class="authority-standard__phrase">
        Não é sobre resistir mais.<br>É sobre perceber antes.
      </div>
    </div>
  </div>
</section>
```

Em páginas com CSS próprio, os nomes de classe podem ser adaptados, desde que a estrutura, a foto, o título e a copy sejam preservados.

## Rodapé Final Padrão

Todas as páginas HTML devem terminar com o rodapé ético padrão.

Conteúdo obrigatório:

```html
<footer class="ethical-footer">
  <p>
    <strong>Aviso Legal:</strong> Este material é educativo e informativo. Não substitui acompanhamento médico, psicológico, nutricional ou financeiro. O Padrão Interrompido™ não promete cura, emagrecimento, enriquecimento ou resultado estético. Se você está enfrentando questões de saúde mental graves, procure um profissional qualificado.
  </p>
  <p>
    © 2026 Marcos Vinicius — Todos os direitos reservados.<br>
    <a href="https://instagram.com/marcosvinicius.mpi">@marcosvinicius.mpi</a> •
    <a href="https://padraointerrompido.com.br">padraointerrompido.com.br</a>
  </p>
  <p>
    Seus dados são tratados conforme a LGPD e usados apenas para comunicação, entrega de materiais e relacionamento com consentimento. Você pode solicitar atualização ou exclusão pelo e-mail <a href="mailto:contato@padraointerrompido.com.br">contato@padraointerrompido.com.br</a>.
  </p>
  <p>
    <a href="https://padraointerrompido.com.br/politica-de-privacidade/">Política de Privacidade</a> •
    <a href="https://padraointerrompido.com.br/termos-de-uso/">Termos de Uso</a>
  </p>
</footer>
```

## Regras de Consistência

- Não usar e-mails pessoais em páginas públicas.
- Não usar links vazios para Instagram.
- Não usar rodapés alternativos sem aviso legal e LGPD.
- Não remover links de Política de Privacidade e Termos de Uso.
- Usar URLs absolutas para links legais quando a página estiver em subpastas.
- Manter a seção de autoridade antes do rodapé em páginas de venda e captura.
