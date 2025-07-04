# 🗄️ Base de Dados - Doce Sensações

## 📋 Visão Geral

Este documento descreve a estrutura da base de dados para o site **Doce Sensações**, uma confeitaria online que permite aos clientes fazer pedidos de doces, bolos e outros produtos artesanais.

## 🏗️ Estrutura das Tabelas

### **1. Usuários (`users`)**
- **Propósito**: Armazenar dados dos clientes e administradores
- **Campos principais**: nome, email, senha, telefone, avatar, pontos de fidelidade
- **Relacionamentos**: Um usuário pode ter múltiplos endereços, pedidos, avaliações

### **2. Produtos (`products`)**
- **Propósito**: Catálogo de produtos da confeitaria
- **Campos principais**: nome, descrição, preço, desconto, estoque, imagem
- **Relacionamentos**: Pertence a uma categoria, pode ter múltiplas avaliações

### **3. Pedidos (`orders`)**
- **Propósito**: Histórico completo de pedidos dos clientes
- **Campos principais**: número do pedido, status, valores, método de pagamento
- **Relacionamentos**: Pertence a um usuário, tem múltiplos itens

### **4. Avaliações (`reviews`)**
- **Propósito**: Sistema de feedback dos clientes
- **Campos principais**: nota (1-5), comentário, público/privado
- **Relacionamentos**: Vinculado a usuário, pedido e produto

### **5. Cupons (`discount_coupons`)**
- **Propósito**: Sistema de promoções e descontos
- **Campos principais**: código, tipo de desconto, valor, validade
- **Relacionamentos**: Pode ser usado por múltiplos usuários

## 🚀 Próximos Passos para Implementação

### **FASE 1: Configuração do Ambiente**
1. **Escolher SGBD**:
   - **MySQL** (recomendado para começar)
   - **PostgreSQL** (mais robusto para produção)
   - **SQLite** (para desenvolvimento/testes)

2. **Configurar Backend**:
   - **Node.js + Express** ou **PHP + Laravel**
   - **API REST** para comunicação com frontend
   - **Autenticação JWT** para sessões

3. **Configurar Frontend**:
   - **Axios** ou **Fetch API** para requisições
   - **LocalStorage/SessionStorage** para cache
   - **Interceptors** para autenticação automática

### **FASE 2: Desenvolvimento das APIs**

#### **2.1 Autenticação**
```javascript
// Endpoints necessários
POST /api/auth/register    // Cadastro de usuário
POST /api/auth/login       // Login
POST /api/auth/logout      // Logout
GET  /api/auth/profile     // Dados do perfil
PUT  /api/auth/profile     // Atualizar perfil
```

#### **2.2 Produtos**
```javascript
// Endpoints necessários
GET    /api/products           // Listar produtos
GET    /api/products/:id       // Detalhes do produto
GET    /api/products/featured  // Produtos em destaque
GET    /api/categories         // Categorias
POST   /api/products           // Criar produto (admin)
PUT    /api/products/:id       // Atualizar produto (admin)
DELETE /api/products/:id       // Deletar produto (admin)
```

#### **2.3 Pedidos**
```javascript
// Endpoints necessários
GET    /api/orders             // Histórico de pedidos
GET    /api/orders/:id         // Detalhes do pedido
POST   /api/orders             // Criar novo pedido
PUT    /api/orders/:id/status  // Atualizar status (admin)
```

#### **2.4 Carrinho**
```javascript
// Endpoints necessários
GET    /api/cart               // Itens do carrinho
POST   /api/cart/add           // Adicionar item
PUT    /api/cart/update        // Atualizar quantidade
DELETE /api/cart/remove/:id    // Remover item
POST   /api/cart/clear         // Limpar carrinho
```

### **FASE 3: Integração com Frontend**

#### **3.1 Substituir Dados Simulados**
- Remover arrays hardcoded do JavaScript
- Implementar chamadas para APIs
- Adicionar loading states e error handling

#### **3.2 Sistema de Autenticação**
- Integrar login/cadastro com backend
- Implementar proteção de rotas
- Adicionar refresh tokens

#### **3.3 Carrinho Persistente**
- Salvar carrinho no banco de dados
- Sincronizar entre dispositivos
- Implementar checkout completo

### **FASE 4: Funcionalidades Avançadas**

#### **4.1 Sistema de Pagamento**
- **PIX** (recomendado para Brasil)
- **Cartão de crédito** (Stripe/PayPal)
- **Pagamento na entrega**

#### **4.2 Notificações**
- **Email** para confirmação de pedidos
- **WhatsApp** para status de entrega
- **Push notifications** no site

#### **4.3 Dashboard Admin**
- Gerenciar produtos e estoque
- Visualizar pedidos e status
- Relatórios de vendas
- Gerenciar cupons

## 🛠️ Tecnologias Recomendadas

### **Backend**
- **Node.js + Express** ou **PHP + Laravel**
- **MySQL** ou **PostgreSQL**
- **JWT** para autenticação
- **Multer** para upload de imagens
- **Nodemailer** para emails

### **Frontend**
- **Axios** para requisições HTTP
- **SweetAlert2** para notificações
- **Chart.js** para gráficos (admin)
- **Dropzone.js** para upload de imagens

### **DevOps**
- **Docker** para containerização
- **GitHub Actions** para CI/CD
- **Vercel/Netlify** para deploy frontend
- **Railway/Heroku** para deploy backend

## 📊 Estrutura de Arquivos Recomendada

```
backend/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   └── utils/
├── database/
│   ├── migrations/
│   └── seeds/
└── uploads/

frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
└── public/
```

## 🔐 Considerações de Segurança

1. **Autenticação**: JWT com refresh tokens
2. **Validação**: Sanitização de inputs
3. **Criptografia**: Senhas com bcrypt
4. **CORS**: Configuração adequada
5. **Rate Limiting**: Proteção contra spam
6. **HTTPS**: Certificado SSL obrigatório

## 📈 Próximos Passos Imediatos

1. **Escolher stack tecnológica**
2. **Configurar ambiente de desenvolvimento**
3. **Criar estrutura do backend**
4. **Implementar autenticação básica**
5. **Criar APIs de produtos**
6. **Integrar com frontend existente**
7. **Testar funcionalidades básicas**
8. **Deploy em ambiente de produção**

---

**Status**: 📋 Planejamento Concluído  
**Próxima Ação**: 🚀 Iniciar desenvolvimento do backend 