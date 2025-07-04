# 🍰 Doce Sensações - Guia dos Próximos Passos

## ✅ Status Atual
- ✅ Dependências instaladas
- ✅ Servidor de teste funcionando
- ✅ APIs básicas operacionais
- ✅ Estrutura do projeto criada

## 🚀 Próximos Passos

### 1. **Configurar Google Sheets (Recomendado)**
Para ter um banco de dados real, configure o Google Sheets:

```bash
# 1. Execute o script de autenticação
npm run auth

# 2. Siga as instruções para:
#    - Criar projeto no Google Cloud Console
#    - Ativar Google Sheets API
#    - Criar Service Account
#    - Baixar arquivo de credenciais
#    - Configurar planilha
```

### 2. **Testar APIs Atuais**
O servidor está rodando em `http://localhost:3001`. Teste:

```bash
# Página inicial
curl http://localhost:3001

# Listar produtos
curl http://localhost:3001/api/products

# Login (POST)
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@teste.com","password":"123456"}'
```

### 3. **Conectar Frontend ao Backend**
Atualize o frontend para usar as APIs:

```javascript
// Exemplo de como conectar
const API_BASE = 'http://localhost:3001/api';

// Buscar produtos
fetch(`${API_BASE}/products`)
  .then(response => response.json())
  .then(data => {
    console.log('Produtos:', data.products);
  });

// Login
fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@teste.com',
    password: '123456'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Login:', data);
});
```

### 4. **Configurar Variáveis de Ambiente**
Crie um arquivo `.env` na pasta `backend/`:

```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Google Sheets (após configuração)
GOOGLE_SHEETS_ID=sua_planilha_id
GOOGLE_SERVICE_ACCOUNT_EMAIL=seu_service_account@projeto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# JWT
JWT_SECRET=doce_sensacoes_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
```

### 5. **Ativar Servidor Completo**
Após configurar Google Sheets:

```bash
# Parar servidor de teste (Ctrl+C)
# Iniciar servidor completo
npm run dev
```

### 6. **Funcionalidades Disponíveis**

#### APIs de Produtos:
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/featured` - Produtos em destaque
- `GET /api/products/categories` - Categorias
- `GET /api/products/:id` - Produto específico
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Atualizar produto (admin)
- `DELETE /api/products/:id` - Deletar produto (admin)

#### APIs de Autenticação:
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `POST /api/auth/logout` - Logout
- `GET /api/auth/profile` - Perfil do usuário

#### APIs de Pedidos:
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/:id` - Detalhes do pedido
- `PUT /api/orders/:id/status` - Atualizar status

### 7. **Estrutura da Planilha Google Sheets**
Após configurar, a planilha terá estas abas:

1. **users** - Usuários do sistema
2. **products** - Produtos/cardápio
3. **categories** - Categorias de produtos
4. **orders** - Pedidos
5. **order_items** - Itens dos pedidos
6. **reviews** - Avaliações
7. **coupons** - Cupons de desconto

### 8. **Comandos Úteis**

```bash
# Desenvolvimento
npm run dev          # Servidor com auto-reload
npm run start        # Servidor de produção
npm run test         # Executar testes

# Configuração
npm run auth         # Configurar Google Sheets
npm run setup        # Setup inicial
```

### 9. **Próximas Funcionalidades**
- [ ] Upload de imagens
- [ ] Sistema de pagamentos
- [ ] Notificações por email
- [ ] Dashboard administrativo
- [ ] Relatórios de vendas
- [ ] Sistema de cupons
- [ ] Avaliações e comentários

## 🎯 Objetivo Final
Ter um sistema completo de e-commerce para doces artesanais com:
- ✅ Backend funcional
- ✅ APIs RESTful
- ✅ Autenticação segura
- ✅ Banco de dados (Google Sheets)
- 🔄 Frontend conectado
- 🔄 Sistema de pedidos
- 🔄 Painel administrativo

## 📞 Suporte
Se precisar de ajuda em qualquer etapa, me avise! 🍰 