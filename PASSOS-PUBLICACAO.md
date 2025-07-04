# 🚀 Passos para Publicar o Site Doce Sensações

## ✅ **Arquivos Criados para Deploy**

- ✅ `_redirects` - Configuração Netlify
- ✅ `netlify.toml` - Configurações de segurança
- ✅ `.gitignore` - Excluir arquivos sensíveis
- ✅ `README.md` - Documentação do projeto

## 📋 **Checklist de Publicação**

### **1. Preparar Repositório GitHub**
```bash
# Na pasta raiz do projeto
git init
git add .
git commit -m "Site Doce Sensações pronto para deploy"
git branch -M main
git remote add origin https://github.com/seu-usuario/doce-sensacoes.git
git push -u origin main
```

### **2. Deploy Frontend (Netlify)**
1. **Acesse:** https://netlify.com
2. **Faça login** com GitHub
3. **Clique em "New site from Git"**
4. **Selecione GitHub**
5. **Escolha seu repositório**
6. **Configurações:**
   - Build command: (deixe vazio)
   - Publish directory: `.`
7. **Clique em "Deploy site"**

### **3. Deploy Backend (Render)**
1. **Acesse:** https://render.com
2. **Faça login** com GitHub
3. **Clique em "New Web Service"**
4. **Conecte seu repositório**
5. **Configurações:**
   - Name: `doce-sensacoes-backend`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
6. **Clique em "Create Web Service"**

### **4. Configurar Variáveis de Ambiente (Backend)**
No Render, adicione estas variáveis:
```env
PORT=3000
NODE_ENV=production
GOOGLE_CREDENTIALS_FILE=google-credentials.json
GOOGLE_SHEETS_ID=18dSNYrPRpUdlOWhURS3xahTbdbELyplPSa47aqfIm7w
JWT_SECRET=doce_sensacoes_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://seu-site.netlify.app
```

### **5. Atualizar URL da API**
Após o deploy do backend, atualize em `src/javascript/api-connection.js`:
```javascript
const API_BASE_URL = 'https://seu-backend.onrender.com/api';
```

### **6. Fazer Novo Deploy**
```bash
git add .
git commit -m "Atualizar URL da API"
git push
```

## 🌐 **URLs Finais**

- **Frontend:** `https://doce-sensacoes.netlify.app`
- **Backend:** `https://doce-sensacoes-backend.onrender.com`
- **Planilha:** `https://docs.google.com/spreadsheets/d/18dSNYrPRpUdlOWhURS3xahTbdbELyplPSa47aqfIm7w`

## 🎯 **Próximos Passos**

1. **Criar repositório no GitHub**
2. **Deploy no Netlify**
3. **Deploy no Render**
4. **Configurar variáveis de ambiente**
5. **Atualizar URLs**
6. **Testar site online**

## 📞 **Precisa de Ajuda?**

Se tiver dúvidas sobre:
- Como criar repositório GitHub
- Como configurar Netlify
- Como configurar Render
- Como configurar variáveis de ambiente

Me avise! Vou te ajudar em cada etapa! 🍰 