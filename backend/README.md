# Doce Sensações - Backend

## Estrutura do Projeto

```
backend/
├── package.json
├── package-lock.json
├── server.js              # Servidor principal
├── .env                   # Variáveis de ambiente
├── .gitignore
├── google-credentials.json # Credenciais Google
├── src/                   # Código fonte
│   ├── config/           # Configurações
│   │   ├── database.js   # Configuração do banco
│   │   └── googleSheets.js # Configuração Google Sheets
│   ├── controllers/      # Controladores
│   │   ├── authController.js # Controle de autenticação
│   │   └── productController.js # Controle de produtos
│   ├── middleware/       # Middlewares
│   │   ├── auth.js       # Middleware de autenticação
│   │   └── validation.js # Validação de dados
│   └── routes/           # Rotas
│       ├── auth.js       # Rotas de autenticação
│       └── products.js   # Rotas de produtos
└── scripts/              # Scripts utilitários
    ├── setup.js          # Setup inicial
    └── google-auth.js    # Autenticação Google
```

## Funcionalidades

### Autenticação
- Login com email/senha
- Registro de usuários
- JWT tokens
- Hashing de senhas (bcrypt)
- Proteção de rotas

### Produtos
- CRUD de produtos
- Integração com Google Sheets
- Busca e filtros
- Imagens e descrições

### Google Sheets
- Leitura de dados
- Escrita de dados
- Autenticação via Service Account
- Cache de dados

## Configuração

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente**:
   ```bash
   cp .env.example .env
   # Editar .env com suas credenciais
   ```

3. **Configurar Google Sheets**:
   - Criar projeto no Google Cloud
   - Ativar Google Sheets API
   - Criar Service Account
   - Baixar credentials.json
   - Compartilhar planilha com o email do service account

4. **Executar**:
   ```bash
   npm start
   ```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil do usuário (protegido)

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto
- `POST /api/products` - Criar produto (protegido)
- `PUT /api/products/:id` - Atualizar produto (protegido)
- `DELETE /api/products/:id` - Deletar produto (protegido)

## Deploy

O projeto está configurado para deploy no Render:
- Build Command: `npm install`
- Start Command: `npm start`
- Environment Variables: Configurar no painel do Render

## Tecnologias

- Node.js
- Express.js
- JWT (jsonwebtoken)
- bcrypt
- Google Sheets API
- CORS
- Helmet (segurança) 