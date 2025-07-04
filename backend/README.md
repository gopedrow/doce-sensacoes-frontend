# 🍰 Backend API - Doce Sensações (Google Sheets)

Backend completo para o site **Doce Sensações** desenvolvido com Node.js, Express e **Google Sheets** como banco de dados.

## 🚀 Funcionalidades

- ✅ **Autenticação JWT** - Login, cadastro e gerenciamento de perfil
- ✅ **CRUD de Produtos** - Gerenciamento completo de produtos
- ✅ **Sistema de Categorias** - Organização de produtos
- ✅ **Validação de Dados** - Validação robusta com express-validator
- ✅ **Segurança** - Helmet, CORS, Rate Limiting
- ✅ **Google Sheets** - Banco de dados na nuvem
- ✅ **Middleware de Autenticação** - Proteção de rotas
- ✅ **Tratamento de Erros** - Sistema completo de error handling

## 📋 Pré-requisitos

- **Node.js** (versão 16 ou superior)
- **Conta Google** com acesso ao Google Sheets
- **npm** ou **yarn**

## 🛠️ Instalação

### 1. Clonar e instalar dependências
```bash
cd backend
npm install
```

### 2. Configurar Google Sheets
```bash
# Executar script de configuração
npm run auth

# Ou configurar manualmente:
cp env.example .env
# Editar .env com suas configurações
```

### 3. Configurar planilha
```bash
# Configurar estrutura da planilha
node scripts/setup-sheets.js
```

### 4. Iniciar servidor
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

## 🔧 Configuração do Google Sheets

### Passo a Passo:

1. **Acesse**: https://console.cloud.google.com/
2. **Crie um projeto** ou selecione existente
3. **Ative a Google Sheets API**:
   - Vá em "APIs e serviços" > "Biblioteca"
   - Procure "Google Sheets API" e ative
4. **Crie uma Service Account**:
   - Vá em "APIs e serviços" > "Credenciais"
   - Clique "Criar credenciais" > "Conta de serviço"
   - Preencha os dados e crie
5. **Baixe as credenciais**:
   - Clique na conta de serviço criada
   - Vá na aba "Chaves" > "Adicionar chave" > "Criar nova chave"
   - Escolha JSON e baixe o arquivo
6. **Crie uma planilha** no Google Sheets
7. **Compartilhe a planilha** com o email da Service Account (com permissão de editor)
8. **Copie o ID da planilha** da URL (parte entre /d/ e /edit)

### Variáveis de Ambiente (.env)

```env
# Servidor
PORT=3000
NODE_ENV=development

# Google Sheets
GOOGLE_SHEETS_ID=sua_planilha_id_aqui
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu_service_account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"

# JWT
JWT_SECRET=sua_chave_secreta_jwt_aqui
JWT_EXPIRES_IN=7d

# Segurança
CORS_ORIGIN=http://localhost:5000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 📚 Endpoints da API

### 🔐 Autenticação

#### `POST /api/auth/register`
Cadastrar novo usuário
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "123456",
  "phone": "(11) 99999-9999"
}
```

#### `POST /api/auth/login`
Fazer login
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

#### `GET /api/auth/profile`
Buscar perfil do usuário (requer token)

#### `PUT /api/auth/profile`
Atualizar perfil (requer token)

### 🍰 Produtos

#### `GET /api/products`
Listar produtos (público)
```
Query params:
- category: ID da categoria
- featured: true/false
- search: termo de busca
- limit: número de itens (padrão: 50)
- offset: offset para paginação
```

#### `GET /api/products/featured`
Produtos em destaque (público)

#### `GET /api/products/categories`
Listar categorias (público)

#### `GET /api/products/:id`
Detalhes do produto (público)

#### `POST /api/products`
Criar produto (apenas admin)
```json
{
  "name": "Bolo de Chocolate",
  "description": "Delicioso bolo de chocolate",
  "price": 45.00,
  "category_id": "cat1",
  "stock_quantity": 10,
  "is_featured": true
}
```

#### `PUT /api/products/:id`
Atualizar produto (apenas admin)

#### `DELETE /api/products/:id`
Deletar produto (apenas admin)

## 🗄️ Estrutura da Planilha

O sistema cria automaticamente as seguintes abas:

- **users** - Usuários e administradores
- **products** - Catálogo de produtos
- **categories** - Categorias de produtos
- **orders** - Pedidos dos clientes
- **order_items** - Itens dos pedidos
- **reviews** - Avaliações dos produtos
- **coupons** - Cupons de desconto
- **shopping_cart** - Carrinho de compras

## 🔒 Autenticação

### Headers necessários
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
Content-Type: application/json
```

### Exemplo de uso
```javascript
const response = await fetch('http://localhost:3000/api/auth/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 🏗️ Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── googleSheets.js      # Configuração do Google Sheets
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticação
│   │   └── productController.js # Lógica de produtos
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticação
│   │   └── validation.js        # Tratamento de validação
│   ├── routes/
│   │   ├── auth.js              # Rotas de autenticação
│   │   └── products.js          # Rotas de produtos
│   └── server.js                # Servidor principal
├── scripts/
│   ├── google-auth.js           # Configuração de autenticação
│   └── setup-sheets.js          # Configuração da planilha
├── package.json
├── env.example
└── README.md
```

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch
```

## 📊 Scripts Disponíveis

```bash
npm start          # Iniciar em produção
npm run dev        # Iniciar em desenvolvimento
npm run auth       # Configurar autenticação Google
npm run setup      # Configuração inicial
```

## 🔍 Debug e Logs

O servidor inclui logs detalhados para debug:

```bash
# Logs de conexão com Google Sheets
✅ Conexão com Google Sheets estabelecida com sucesso!
📊 Planilha: Doce Sensações - Database
📋 Abas disponíveis: users, products, categories, orders

# Logs de erro
❌ Erro ao conectar com Google Sheets: Access denied

# Logs de inicialização
🚀 Servidor iniciado com sucesso!
📍 URL: http://localhost:3000
🌍 Ambiente: development
🗄️  Banco de dados: Google Sheets - Conectado
```

## 🚨 Tratamento de Erros

A API retorna erros padronizados:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

## 🔐 Segurança

- **Helmet**: Headers de segurança
- **CORS**: Configuração de origens permitidas
- **Rate Limiting**: Proteção contra spam
- **JWT**: Autenticação segura
- **Validação**: Sanitização de inputs
- **Bcrypt**: Criptografia de senhas

## 💡 Vantagens do Google Sheets

✅ **Fácil de usar** - Interface familiar  
✅ **Acesso em qualquer lugar** - Nuvem  
✅ **Backup automático** - Sempre seguro  
✅ **Colaboração** - Múltiplos usuários  
✅ **Gratuito** - Para uso básico  
✅ **Integração** - Com outras ferramentas Google  

## 📈 Próximos Passos

1. **Implementar carrinho de compras**
2. **Sistema de pedidos**
3. **Upload de imagens**
4. **Sistema de avaliações**
5. **Cupons de desconto**
6. **Notificações por email**
7. **Dashboard administrativo**

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

**Status**: ✅ Backend Funcional com Google Sheets  
**Versão**: 1.0.0  
**Última atualização**: Dezembro 2024 