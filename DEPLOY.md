# 🚀 Deploy - Doce Sensações

## Backend (Render.com)

### 1. Criar conta no Render
- Acesse: https://render.com
- Faça login com GitHub

### 2. Criar novo Web Service
- Clique em "New +" → "Web Service"
- Conecte o repositório GitHub
- Selecione o repositório "doce-sensacoes"

### 3. Configurações do Web Service
```
Name: doce-sensacoes-api
Environment: Node
Build Command: npm install
Start Command: npm start
```

### 4. Variáveis de Ambiente
Adicione as seguintes variáveis:
```
NODE_ENV=production
JWT_SECRET=doce_sensacoes_production_secret_key_2024
CORS_ORIGIN=https://doce-sensacoes.netlify.app
GOOGLE_SHEETS_ENABLED=false
HELMET_ENABLED=true
COMPRESSION_ENABLED=true
```

### 5. Deploy
- Clique em "Create Web Service"
- Aguarde o deploy (pode demorar alguns minutos)
- A URL será: `https://doce-sensacoes-api.onrender.com`

## Frontend (Netlify)

### 1. Criar conta no Netlify
- Acesse: https://netlify.com
- Faça login com GitHub

### 2. Deploy Manual
- Arraste a pasta `frontend` para o Netlify
- Ou conecte o repositório GitHub

### 3. Configurações
```
Build command: (deixar vazio)
Publish directory: frontend
```

### 4. Variáveis de Ambiente (opcional)
```
API_URL=https://doce-sensacoes-api.onrender.com
```

### 5. Deploy
- Clique em "Deploy site"
- A URL será: `https://doce-sensacoes.netlify.app`

## Testes

### 1. Testar Backend
```bash
curl https://doce-sensacoes-api.onrender.com/api/products
```

### 2. Testar Frontend
- Acesse: https://doce-sensacoes.netlify.app
- Faça login com: teste@teste.com / 123456

## URLs Finais

- **Frontend**: https://doce-sensacoes.netlify.app
- **Backend API**: https://doce-sensacoes-api.onrender.com
- **Documentação**: https://doce-sensacoes-api.onrender.com/health

## Funcionalidades Disponíveis

✅ Login/Cadastro de usuários
✅ Listagem de produtos
✅ Carrinho de compras
✅ Perfil dinâmico
✅ Sistema de cupons
✅ Finalização de pedidos
✅ Responsivo para mobile
✅ PWA (Progressive Web App) 