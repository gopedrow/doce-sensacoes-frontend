// Configuração temporária para teste inicial
// Este arquivo será usado até você configurar o Google Sheets

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Dados temporários em memória (para teste)
const tempData = {
  users: [
    {
      id: '1',
      name: 'Admin Teste',
      email: 'admin@teste.com',
      user_type: 'admin',
      is_active: 'TRUE'
    }
  ],
  products: [
    {
      id: '1',
      name: 'Bolo de Chocolate',
      description: 'Delicioso bolo de chocolate artesanal',
      price: '45.00',
      category_id: '1',
      is_featured: 'TRUE',
      is_active: 'TRUE'
    },
    {
      id: '2',
      name: 'Brigadeiro Gourmet',
      description: 'Caixa com 6 brigadeiros especiais',
      price: '18.00',
      category_id: '2',
      is_featured: 'TRUE',
      is_active: 'TRUE'
    }
  ],
  categories: [
    { id: '1', name: 'Bolos', is_active: 'TRUE' },
    { id: '2', name: 'Doces', is_active: 'TRUE' }
  ]
};

// Criar aplicação Express
const app = express();

// Configurações de segurança
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Middlewares
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Doce Sensações funcionando! 🍰',
    version: '1.0.0',
    database: 'Temporário (Memória)',
    timestamp: new Date().toISOString()
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    database: 'Temporário - Funcionando',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API de produtos (temporária)
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    products: tempData.products,
    pagination: {
      total: tempData.products.length,
      limit: 50,
      offset: 0,
      pages: 1
    }
  });
});

app.get('/api/products/featured', (req, res) => {
  const featured = tempData.products.filter(p => p.is_featured === 'TRUE');
  res.json({
    success: true,
    products: featured
  });
});

app.get('/api/products/categories', (req, res) => {
  res.json({
    success: true,
    categories: tempData.categories
  });
});

// API de autenticação (temporária)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@teste.com' && password === '123456') {
    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token: 'teste_token_123',
      user: tempData.users[0]
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Configuração da porta
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Servidor temporário iniciado com sucesso!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: Teste (sem Google Sheets)`);
  console.log('📚 APIs disponíveis:');
  console.log(`   - GET  / - Página inicial`);
  console.log(`   - GET  /health - Status do servidor`);
  console.log(`   - GET  /api/products - Listar produtos`);
  console.log(`   - GET  /api/products/featured - Produtos em destaque`);
  console.log(`   - GET  /api/products/categories - Categorias`);
  console.log(`   - POST /api/auth/login - Login (admin@teste.com / 123456)`);
  console.log('\n💡 Para configurar Google Sheets completo, execute: npm run auth');
  console.log('🍰 Doce Sensações API está funcionando!');
});

module.exports = app; 