# 🚀 Setup Inicial — PADRÃO INTERROMPIDO™

## Pré-requisitos

✅ GitHub account  
✅ Netlify account (grátis)  
✅ Editor de texto (VS Code recomendado)  
✅ Conhecimento básico de Git  

---

## Passo 1: Clonar Repositório

```bash
git clone https://github.com/marvin-ds/padrao-interrompido-site.git
cd padrao-interrompido-site
```

---

## Passo 2: Conectar ao Netlify

### Opção A: Deploy via GitHub (Recomendado)
1. Vá para [netlify.com](https://netlify.com)
2. Sign in com GitHub
3. Clique "New site from Git"
4. Selecione repositório `padrao-interrompido-site`
5. Deploy settings:
   - Build command: (deixe vazio)
   - Publish directory: `/` (root)
6. Clique "Deploy site"

### Opção B: Deploy via Drag & Drop
1. Compacte a pasta local: `zip -r site.zip .`
2. Arraste `site.zip` em [netlify.com/drop](https://netlify.com/drop)
3. Receba URL temporária

---

## Passo 3: Configurar Domínio

### Usar domínio já existente (padraointerrompido.com.br)

1. **Netlify:** Vá para Site settings → Domain management
2. **Add custom domain:** `padraointerrompido.com.br`
3. **Seu registrador DNS:** Apontará para Netlify nameservers
4. **Aguarde:** 24-48 horas para propagação DNS

### Ou usar domínio grátis Netlify
- `seu-site.netlify.app` (automático)

---

## Passo 4: Configurar Variáveis de Ambiente

1. Copie `.env.example` → `.env.local`
2. Preencha valores (NÃO commitar .env.local):

```env
# Zapier
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/[SEU_ID]/[SEU_HOOK]/

# Google Analytics
GA4_ID=G-XXXXXXXXXX

# Meta Pixel
META_PIXEL_ID=123456789

# Eduzz
EDUZZ_AFFILIATE_ID=seu_id

# Resend (email transacional)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

3. **Netlify:** Site settings → Environment → Add variables

---

## Passo 5: Testar Localmente

### Abrir página HTML direto
```bash
# Windows
start index.html

# Mac
open index.html

# Linux
xdg-open index.html
```

### Ou usar servidor local (opcional)
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Então acesse: http://localhost:8000
```

---

## Passo 6: Validar Setup

### Checklist Técnico
- [ ] Site abre sem erros no navegador
- [ ] Console JS está limpo (F12)
- [ ] Imagens carregam
- [ ] CSS está aplicado (cores corretas)
- [ ] Formulários renderizam

### Checklist Performance
- [ ] Lighthouse score >90
- [ ] Carregamento <2 segundos
- [ ] Mobile responsive (teste em 375px)

### Checklist Integrações
- [ ] GA4 tag presente (gtag script)
- [ ] Meta Pixel presente (fbq script)
- [ ] Formulários enviam (teste Netlify Forms)

---

## Passo 7: Fazer Primeiro Push

```bash
git add .
git commit -m "Setup inicial: estrutura base e documentação"
git push origin main
```

✅ Netlify faz deploy automático em ~30 segundos!

---

## Troubleshooting

### "Erro: não consigo abrir arquivo local"
**Solução:** Arraste o arquivo `.html` para o navegador

### "Deploy no Netlify falha"
**Solução:** 
1. Verifique `netlify.toml` está no root
2. Confira nomes de arquivo (case-sensitive no Linux)
3. Não há `node_modules/` ou build script

### "Formulário não envia"
**Solução:**
1. Form precisa atributo `name` e `method="POST"`
2. Netlify Forms requer `netlify` attribute
3. Verifique console (F12) para erros JS

---

## Próximos Passos

1. ✅ Editar conteúdo das páginas
2. ✅ Adicionar imagens do cliente
3. ✅ Testar formulários e integrações
4. ✅ Monitorar GA4/Meta Pixel
5. ✅ A/B testing de CTAs

**Estimado:** 2-3 semanas até Fase 2 completa
