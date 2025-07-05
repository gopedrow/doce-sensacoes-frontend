# 🚀 Guia para Upload do Backend no GitHub

## 📁 Arquivos que precisam ser enviados para o GitHub:

### **Pasta `backend/` (CRÍTICA)**

**Arquivos principais:**
- `package.json` - Dependências do Node.js
- `package-lock.json` - Versões exatas das dependências
- `teste-simples.js` - Servidor de teste
- `config-temp.js` - Configurações
- `setup-env.js` - Configuração de ambiente

**Pasta `src/` (dentro de backend/):**
- `server.js` - Servidor principal
- `routes/` - Rotas da API
- `controllers/` - Controladores
- `middleware/` - Middlewares
- `config/` - Configurações

**Documentação:**
- `README.md` - Documentação do backend
- `GUIA-*.md` - Guias de configuração
- `env.example` - Exemplo de variáveis de ambiente

### **Arquivos de configuração:**
- `_redirects` - Configuração do Netlify
- `.gitignore` - Arquivos ignorados pelo Git

## 🎯 Como fazer o upload:

### **Opção 1: Upload Manual (Recomendado)**
1. Vá para https://github.com/gopedrow/doce-sensacoes
2. Clique em "Add file" → "Upload files"
3. Arraste a pasta `backend/` inteira
4. Adicione também o arquivo `_redirects`
5. Clique em "Commit changes"

### **Opção 2: Upload Individual**
1. Adicione cada arquivo individualmente
2. Comece pelos arquivos principais
3. Depois adicione as pastas

## ⚠️ IMPORTANTE:
- **NÃO envie** a pasta `node_modules/` (será instalada automaticamente)
- **NÃO envie** o arquivo `.env` (configure as variáveis no servidor)
- **NÃO envie** `google-credentials.json` (configure no servidor)

## 🚀 Depois do upload:
1. Conectar GitHub ao Netlify (frontend)
2. Deploy do backend no Render
3. Configurar variáveis de ambiente
4. Conectar frontend com backend

---
**Status atual:** ✅ Frontend pronto | ❌ Backend pendente 