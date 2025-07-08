const express = require('express');
const cors = require('cors');

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:5000', 'http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:5000', 'http://127.0.0.1:8080', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Doce Sensações funcionando! 🍰',
    version: '1.0.0',
    database: 'Test Mode',
    timestamp: new Date().toISOString()
  });
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    database: 'Test Mode - No Google Sheets',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota de produtos mock
app.get('/api/products', (req, res) => {
  const products = [
    {
      id: 1,
      name: 'Bolo de Chocolate',
      desc: 'Massa fofinha, recheio cremoso e cobertura de chocolate belga.',
      price: 45.00,
      img: 'assets/images/dish.png',
      category: 'Bolos'
    },
    {
      id: 2,
      name: 'Torta de Limão',
      desc: 'Base crocante, creme de limão e merengue maçaricado.',
      price: 38.00,
      img: 'assets/images/dish2.png',
      category: 'Tortas'
    },
    {
      id: 3,
      name: 'Brigadeiro Gourmet',
      desc: 'Caixa com 6 unidades de brigadeiro feito com chocolate premium.',
      price: 18.00,
      img: 'assets/images/dish3.png',
      category: 'Doces'
    },
    {
      id: 4,
      name: 'Cheesecake de Frutas Vermelhas',
      desc: 'Cremoso, com calda artesanal de frutas vermelhas.',
      price: 42.00,
      img: 'assets/images/dish4.png',
      category: 'Cheesecakes'
    }
  ];
  
  res.json({
    success: true,
    data: products
  });
});

// Rota de autenticação mock
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'teste@teste.com' && password === '123456') {
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: {
        id: 1,
        name: 'Usuário Teste',
        email: 'teste@teste.com',
        user_type: 'cliente'
      },
      token: 'mock-jwt-token-123'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
});

// Configuração da porta
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Servidor de teste iniciado com sucesso!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Ambiente: Test Mode`);
  console.log('📚 Rotas disponíveis:');
  console.log(`   - GET  / - Teste da API`);
  console.log(`   - GET  /health - Status do servidor`);
  console.log(`   - GET  /api/products - Listar produtos`);
  console.log(`   - POST /api/auth/login - Login (teste@teste.com / 123456)`);
  console.log('🍰 Doce Sensações API está pronta para testes!');
}); 