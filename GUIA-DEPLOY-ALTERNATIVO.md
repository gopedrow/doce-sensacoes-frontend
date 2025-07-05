# 🚀 Guia de Deploy Alternativo - Doce Sensações

## ✅ **Arquivos Prontos**

- ✅ `doce-sensacoes-frontend.zip` - Frontend completo e organizado
- ✅ `backend/` - Backend Node.js + Google Sheets
- ✅ Caminhos corrigidos para produção

## 📦 **Opção 1: Deploy Manual (Recomendado)**

### **Frontend no Netlify**
1. Acesse: https://netlify.com
2. Faça login com GitHub
3. Arraste o arquivo `doce-sensacoes-frontend.zip` para a área de deploy
4. Aguarde o upload e deploy automático
5. Seu site estará online em: `https://random-name.netlify.app`

### **Backend no Render**
1. Acesse: https://render.com
2. Faça login com GitHub
3. Clique em "New Web Service"
4. Conecte o repositório: `gopedrow/doce-sensacoes-backend`
5. Configure:
   - Name: `doce-sensacoes-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Adicione variáveis de ambiente:
   ```
   PORT=3000
   NODE_ENV=production
   GOOGLE_SHEETS_ID=18dSNYrPRpUdlOWhURS3xahTbdbELyplPSa47aqfIm7w
   JWT_SECRET=doce_sensacoes_jwt_secret_key_2024
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://seu-site.netlify.app
   ```

## 🔗 **Opção 2: Deploy via GitHub (Se o push funcionar)**

### **Frontend**
1. Acesse: https://github.com/gopedrow/doce-sensacoes-frontend
2. No Netlify, conecte este repositório
3. Configure:
   - Build command: (deixe vazio)
   - Publish directory: `.` (raiz do repositório)

### **Backend**
1. Acesse: https://github.com/gopedrow/doce-sensacoes-backend
2. No Render, conecte este repositório
3. Configure como Web Service

## 🌐 **URLs Finais**

- **Frontend:** `https://doce-sensacoes.netlify.app`
- **Backend:** `https://doce-sensacoes-backend.onrender.com`

## ⚙️ **Configuração Final**

Após o deploy, atualize em `public/javascript/api-connection.js`:
```javascript
const API_BASE_URL = 'https://doce-sensacoes-backend.onrender.com/api';
```

## 🎯 **Próximos Passos**

1. **Deploy Frontend** (Netlify)
2. **Deploy Backend** (Render)
3. **Configurar variáveis de ambiente**
4. **Atualizar URL da API**
5. **Testar site online**

## 📞 **Precisa de Ajuda?**

Se tiver dúvidas sobre:
- Como fazer upload no Netlify
- Como configurar Render
- Como configurar variáveis de ambiente
- Como testar o site

Me avise! Vou te ajudar em cada etapa! 🍰 