# Paleta de Cores Oficial — Padrão Interrompido™

## Cores Principais

### #000000 — Preto Absoluto
**Função:** Autoridade, impacto, slide de abertura ou Alfinete
**Uso:** Headlines principais, seções de impacto, slides iniciais, contexto de autoridade

### #1B4D5C — Azul Petróleo
**Função:** Técnico, mecanismo, profundidade, slides de explicação visual
**Uso:** Explicações visuais, diagramas, mecânica do padrão, profundidade informacional

### #F5F5F5 — Branco Gelo / Fundo Claro
**Função:** Respiro, clareza, leitura fácil
**Uso:** Fundos principais, áreas de leitura, espaço negativo

### #E8F1F3 — Azul Gelo / Fundo Suave
**Função:** Espelho emocional, acolhimento, identificação
**Uso:** Cards de identificação, seções de reconhecimento, empatia visual

### #D47A3A — Laranja de Interrupção
**Função:** Interrupção, destaque semântico, seta, linha lateral, palavra-chave, CTA
**Uso:** Call-to-action, destaque, ícones, linhas laterais, palavras-chave

---

## Regras Importantes

⚠️ **O laranja não deve ser usado como fundo principal.**
Ele funciona melhor como:
- Corte (linha lateral, borda)
- Destaque (palavras-chave, números)
- Direção do olhar (setas, indicadores)
- CTA (botões, ações)
- Ícones

---

## Variações e Uso Recomendado

### Modo Escuro (Padrão para e-books e landing pages de diagnóstico)
```
Fundo: #000000
Texto principal: #F5F5F5
Texto secundário: #1B4D5C com opacidade
Destaques: #D47A3A
Áreas técnicas: #1B4D5C
```

### Modo Claro (Padrão para conteúdo educativo)
```
Fundo: #F5F5F5
Texto principal: #000000
Texto secundário: #1B4D5C
Destaques: #D47A3A
Áreas de identificação: #E8F1F3
```

---

## Código CSS de Referência

```css
:root {
    --cor-preto: #000000;
    --cor-azul-petroleo: #1B4D5C;
    --cor-branco-gelo: #F5F5F5;
    --cor-azul-gelo: #E8F1F3;
    --cor-laranja-interrupcao: #D47A3A;
}
```

---

## Contraste e Acessibilidade

- ✓ #000000 + #F5F5F5 = Contraste alto (WCAG AAA)
- ✓ #1B4D5C + #F5F5F5 = Contraste adequado (WCAG AA)
- ✓ #D47A3A + #000000 = Contraste alto (WCAG AAA)
- ✓ #D47A3A + #F5F5F5 = Contraste adequado (WCAG AA)

Sempre testar contraste em acessibilidade quando usar laranja em fundos claros.

---

**Última atualização:** 6 de maio, 2026
