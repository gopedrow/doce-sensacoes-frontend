# 🍰 Doce Sensações

Site de confeitaria artesanal com sistema de pedidos online.

## 🌟 **Características**

- ✅ **Design responsivo** e moderno
- ✅ **Sistema de pedidos** online
- ✅ **Banco de dados** Google Sheets
- ✅ **APIs RESTful** completas
- ✅ **Autenticação** segura
- ✅ **Deploy automático** no Netlify

## 🚀 **Tecnologias**

### **Frontend**
- HTML5
- CSS3 (com animações)
- JavaScript (ES6+)
- jQuery
- ScrollReveal

### **Backend**
- Node.js
- Express.js
- Google Sheets API
- JWT Authentication
- CORS

### **Banco de Dados**
- Google Sheets (como banco de dados)

## 📁 **Estrutura do Projeto**

```
doce-sensacoes/
├── index.html              # Página principal
├── src/
│   ├── images/             # Imagens do site
│   ├── styles/             # Arquivos CSS
│   ├── javascript/         # Scripts JavaScript
│   ├── login.html          # Página de login
│   └── perfil.html         # Página do perfil
├── backend/                # Servidor Node.js
│   ├── src/
│   ├── package.json
│   └── google-credentials.json
├── _redirects              # Configuração Netlify
├── netlify.toml           # Configuração Netlify
└── README.md
```

## 🛠️ **Instalação Local**

### **1. Clonar o repositório**
```bash
git clone https://github.com/seu-usuario/doce-sensacoes.git
cd doce-sensacoes
```

### **2. Configurar Backend**
```bash
cd backend
npm install
```

### **3. Configurar Google Sheets**
- Siga o guia em `backend/GUIA-GOOGLE-SHEETS.md`
- Configure as variáveis de ambiente

### **4. Iniciar Servidor**
```bash
npm run dev
```

### **5. Abrir Frontend**
Abra `index.html` no navegador

## 🌐 **Deploy**

### **Frontend (Netlify)**
1. Conecte o repositório ao Netlify
2. Configure o build:
   - Build command: (vazio)
   - Publish directory: `.`

### **Backend (Render/Railway)**
1. Conecte o repositório
2. Configure as variáveis de ambiente
3. Deploy automático

## 📊 **APIs Disponíveis**

### **Produtos**
- `GET /api/products` - Listar produtos
- `GET /api/products/featured` - Produtos em destaque
- `GET /api/products/categories` - Categorias

### **Autenticação**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/profile` - Perfil

### **Pedidos**
- `GET /api/orders` - Listar pedidos
- `POST /api/orders` - Criar pedido
- `PUT /api/orders/:id/status` - Atualizar status

## 🗄️ **Estrutura do Banco de Dados**

### **Aba `users`**
| id | name | email | password_hash | user_type | is_active | created_at |

### **Aba `products`**
| id | name | description | price | category_id | image_url | is_featured | is_active | created_at |

### **Aba `categories`**
| id | name | description | is_active | created_at |

### **Aba `orders`**
| id | user_id | total_amount | status | created_at |

### **Aba `order_items`**
| id | order_id | product_id | quantity | price |

## 🔧 **Configuração**

### **Variáveis de Ambiente**
```env
PORT=3001
NODE_ENV=development
GOOGLE_CREDENTIALS_FILE=google-credentials.json
GOOGLE_SHEETS_ID=sua_planilha_id
JWT_SECRET=seu_jwt_secret
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5000
```

## 📱 **Funcionalidades**

- **Página inicial** com apresentação
- **Cardápio** dinâmico
- **Sistema de login** e registro
- **Carrinho de compras**
- **Perfil do usuário**
- **Avaliações** de clientes
- **Responsivo** para mobile

## 🎨 **Design**

- **Cores:** Tons de amarelo e marrom
- **Fontes:** Dancing Script + Montserrat
- **Estilo:** Moderno e elegante
- **Animações:** ScrollReveal

## 📞 **Suporte**

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte os guias na pasta `backend/`

## 📄 **Licença**

Este projeto é de uso pessoal/comercial.

---

**Desenvolvido com ❤️ para Doce Sensações** 