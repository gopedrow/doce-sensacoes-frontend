# Doce Sensações

Sistema completo de confeitaria artesanal com frontend PWA e backend integrado ao Google Sheets.

## 🍰 Sobre o Projeto

O Doce Sensações é uma plataforma completa para confeitaria artesanal, oferecendo:

- **Frontend PWA**: Interface moderna e responsiva
- **Sistema de Login**: Autenticação JWT com Google Sheets
- **Carrinho de Compras**: Sistema completo de pedidos
- **Dashboard**: Área do cliente com funcionalidades avançadas
- **Integração Google Sheets**: Banco de dados em planilha

## 📁 Estrutura do Projeto

```
DOCE-SENSACOES/
├── frontend/              # Frontend PWA
│   ├── index.html        # Página inicial
│   ├── login.html        # Login
│   ├── cadastro.html     # Cadastro
│   ├── perfil.html       # Dashboard
│   ├── manifest.json     # PWA manifest
│   ├── sw.js            # Service Worker
│   ├── assets/          # Recursos estáticos
│   │   ├── css/         # Estilos
│   │   ├── js/          # JavaScript
│   │   └── images/      # Imagens
│   └── components/      # Componentes
├── backend/             # Backend Node.js
│   ├── src/            # Código fonte
│   │   ├── config/     # Configurações
│   │   ├── controllers/ # Controladores
│   │   ├── middleware/  # Middlewares
│   │   └── routes/     # Rotas
│   └── scripts/        # Scripts utilitários
└── docs/               # Documentação
```

## 🚀 Funcionalidades

### Frontend
- ✅ PWA (Progressive Web App)
- ✅ Design responsivo
- ✅ Tema rosa personalizado
- ✅ Sistema de carrinho flutuante
- ✅ Sidebar colapsável
- ✅ Autenticação social
- ✅ Dashboard completo

### Backend
- ✅ API RESTful
- ✅ Autenticação JWT
- ✅ Integração Google Sheets
- ✅ Hashing de senhas
- ✅ Proteção de rotas
- ✅ Validação de dados

## 🛠️ Tecnologias

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Font Awesome (ícones)
- Google Fonts
- PWA (Service Worker + Manifest)

### Backend
- Node.js
- Express.js
- JWT (jsonwebtoken)
- bcrypt
- Google Sheets API
- CORS, Helmet

## 📦 Instalação

### Pré-requisitos
- Node.js 16+
- Conta Google Cloud
- Google Sheets configurado

### Frontend
```bash
# Navegar para o frontend
cd frontend

# Abrir em servidor local
python -m http.server 8000
# ou
npx serve .
```

### Backend
```bash
# Navegar para o backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Executar
npm start
```

## 🔧 Configuração

### Google Sheets
1. Criar projeto no Google Cloud Console
2. Ativar Google Sheets API
3. Criar Service Account
4. Baixar credentials.json
5. Compartilhar planilha com email do service account

### Variáveis de Ambiente
```env
PORT=3000
JWT_SECRET=sua_chave_secreta
GOOGLE_SHEETS_ID=id_da_sua_planilha
```

## 📱 Deploy

### Frontend (Netlify)
- Conectar repositório
- Build command: vazio
- Publish directory: `frontend`

### Backend (Render)
- Conectar repositório
- Build command: `npm install`
- Start command: `npm start`

## 🎨 Design

### Paleta de Cores
```css
--color-primary-1: #FFF0F5  /* Rosa claro */
--color-primary-2: #FFE4E1  /* Rosa suave */
--color-primary-3: #FFB6C1  /* Rosa médio */
--color-primary-4: #FF69B4  /* Rosa quente */
--color-primary-5: #FF1493  /* Rosa intenso */
--color-primary-6: #EB2E7D  /* Rosa principal */
```

## 📄 Licença

Este projeto é privado e desenvolvido para a Doce Sensações.

## 👥 Desenvolvimento

Projeto desenvolvido com foco em:
- Performance otimizada
- Código limpo e organizado
- Experiência do usuário
- Facilidade de manutenção 