# 🍰 Backend - Doce Sensações

API Node.js + Express para o site de confeitaria Doce Sensações.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Google Sheets API** - Banco de dados
- **JWT** - Autenticação
- **CORS** - Cross-origin requests
- **Helmet** - Segurança

## 📁 Estrutura

```
backend/
├── src/
│   ├── server.js          # Servidor principal
│   ├── routes/            # Rotas da API
│   ├── controllers/       # Controladores
│   ├── middleware/        # Middlewares
│   └── config/           # Configurações
├── package.json          # Dependências
├── teste-simples.js      # Servidor de teste
├── config-temp.js        # Configurações temporárias
└── setup-env.js          # Setup de ambiente
```

## 🔧 Instalação

```bash
npm install
```

## 🏃‍♂️ Execução

### Desenvolvimento
```bash
node teste-simples.js
```

### Produção
```bash
node src/server.js
```

## 📡 Rotas da API

- `GET /` - Health check
- `GET /api/products` - Listar produtos
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Cadastro

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` com:

```env
GOOGLE_SHEETS_ID=sua_planilha_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu_email
GOOGLE_PRIVATE_KEY=sua_chave_privada
JWT_SECRET=sua_chave_secreta
PORT=3000
```

## 🚀 Deploy

1. Configure as variáveis de ambiente
2. Deploy no Render/Railway
3. Configure o Google Sheets
4. Teste as rotas

---
**Status:** ✅ Pronto para deploy 