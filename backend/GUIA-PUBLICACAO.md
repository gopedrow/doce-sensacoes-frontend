# 🌐 Guia Completo - Publicar Site Doce Sensações

## 📋 **Checklist de Publicação**

### ✅ **Backend (Já configurado)**
- ✅ Node.js + Express
- ✅ Google Sheets como banco de dados
- ✅ APIs RESTful funcionando
- ✅ Autenticação JWT
- ✅ CORS configurado

### ✅ **Frontend (Já configurado)**
- ✅ HTML responsivo
- ✅ CSS moderno
- ✅ JavaScript conectado às APIs
- ✅ Imagens otimizadas

## 🚀 **Opções de Publicação**

### **Opção 1: Netlify (Recomendado - Gratuito)**
**Melhor para:** Sites estáticos com APIs externas

### **Opção 2: Vercel (Gratuito)**
**Melhor para:** Sites estáticos com APIs externas

### **Opção 3: GitHub Pages (Gratuito)**
**Melhor para:** Sites estáticos simples

### **Opção 4: Hostinger/GoDaddy (Pago)**
**Melhor para:** Domínio personalizado + hospedagem

---

## 🎯 **Recomendação: Netlify**

### **Por que Netlify?**
- ✅ **Gratuito** para sites pessoais
- ✅ **Deploy automático** do GitHub
- ✅ **HTTPS automático**
- ✅ **CDN global**
- ✅ **Fácil de configurar**

---

## 📝 **Passo a Passo - Netlify**

### **Passo 1: Preparar o Projeto**

1. **Criar repositório no GitHub:**
   ```bash
   # Inicializar Git (se não existir)
   git init
   
   # Adicionar arquivos
   git add .
   
   # Primeiro commit
   git commit -m "Primeira versão do site Doce Sensações"
   
   # Criar repositório no GitHub e conectar
   git remote add origin https://github.com/seu-usuario/doce-sensacoes.git
   git branch -M main
   git push -u origin main
   ```

### **Passo 2: Configurar Netlify**

1. **Acesse:** https://netlify.com
2. **Clique em "Sign up"** (com GitHub)
3. **Clique em "New site from Git"**
4. **Selecione GitHub**
5. **Escolha seu repositório:** `doce-sensacoes`
6. **Configurações de build:**
   - **Build command:** (deixe vazio)
   - **Publish directory:** `.` (ponto)
7. **Clique em "Deploy site"**

### **Passo 3: Configurar Backend**

Como o Netlify é para sites estáticos, você precisa hospedar o backend separadamente:

#### **Opção A: Render (Gratuito)**
1. **Acesse:** https://render.com
2. **Crie conta** com GitHub
3. **Clique em "New Web Service"**
4. **Conecte seu repositório**
5. **Configurações:**
   - **Name:** `doce-sensacoes-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. **Clique em "Create Web Service"**

#### **Opção B: Railway (Gratuito)**
1. **Acesse:** https://railway.app
2. **Conecte GitHub**
3. **Clique em "New Project"**
4. **Selecione "Deploy from GitHub repo"**
5. **Escolha seu repositório**
6. **Configure as variáveis de ambiente**

### **Passo 4: Atualizar URLs no Frontend**

Após hospedar o backend, atualize a URL da API:

```javascript
// Em src/javascript/api-connection.js
const API_BASE_URL = 'https://seu-backend.onrender.com/api';
// ou
const API_BASE_URL = 'https://seu-backend.railway.app/api';
```

### **Passo 5: Configurar Variáveis de Ambiente**

No seu serviço de hospedagem do backend, configure:

```env
PORT=3000
NODE_ENV=production
GOOGLE_CREDENTIALS_FILE=google-credentials.json
GOOGLE_SHEETS_ID=18dSNYrPRpUdlOWhURS3xahTbdbELyplPSa47aqfIm7w
JWT_SECRET=doce_sensacoes_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://seu-site.netlify.app
```

---

## 🔧 **Configurações Específicas**

### **Para Netlify:**

1. **Arquivo `_redirects`** (criar na raiz):
   ```
   /*    /index.html   200
   ```

2. **Arquivo `netlify.toml`** (criar na raiz):
   ```toml
   [build]
     publish = "."
   
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-XSS-Protection = "1; mode=block"
       X-Content-Type-Options = "nosniff"
   ```

### **Para o Backend:**

1. **Atualizar CORS** para aceitar o domínio do frontend
2. **Configurar HTTPS** (automático no Render/Railway)
3. **Configurar variáveis de ambiente**

---

## 📊 **Estrutura Final**

```
🌐 Frontend (Netlify)
├── index.html
├── src/
│   ├── images/
│   ├── styles/
│   └── javascript/
└── _redirects

🔧 Backend (Render/Railway)
├── src/
├── package.json
├── google-credentials.json
└── .env
```

---

## 🎯 **URLs Finais**

- **Frontend:** `https://doce-sensacoes.netlify.app`
- **Backend:** `https://doce-sensacoes-backend.onrender.com`
- **Planilha:** `https://docs.google.com/spreadsheets/d/18dSNYrPRpUdlOWhURS3xahTbdbELyplPSa47aqfIm7w`

---

## 🚀 **Comandos para Deploy**

### **1. Preparar repositório:**
```bash
# Na pasta raiz do projeto
git init
git add .
git commit -m "Site Doce Sensações pronto para deploy"
git branch -M main
git remote add origin https://github.com/seu-usuario/doce-sensacoes.git
git push -u origin main
```

### **2. Deploy no Netlify:**
- Conecte GitHub
- Selecione repositório
- Deploy automático

### **3. Deploy do Backend:**
- Conecte GitHub
- Configure variáveis de ambiente
- Deploy automático

---

## ✅ **Checklist Final**

- [ ] Repositório GitHub criado
- [ ] Frontend deployado no Netlify
- [ ] Backend deployado no Render/Railway
- [ ] URLs atualizadas no frontend
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado
- [ ] HTTPS funcionando
- [ ] Site testado online

---

## 📞 **Precisa de ajuda?**

Se tiver dúvidas sobre:
- Como criar repositório GitHub
- Como configurar Netlify
- Como hospedar backend
- Como configurar domínio personalizado

Me avise! Vou te ajudar em cada etapa! 🍰 