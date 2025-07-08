const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar configurações
// const { testConnection } = require('./config/googleSheets');

// Importar rotas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

// Importar middlewares
const { handleValidationErrors } = require('./middleware/validation');

// Criar aplicação Express
const app = express();

// Configurações de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://unpkg.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutos
  max: process.env.RATE_LIMIT_MAX || 100, // limite por IP
  message: {
    success: false,
    message: 'Muitas requisições. Tente novamente em alguns minutos.'
  }
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:5000', 'http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:5000', 'http://127.0.0.1:8080', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de validação global
app.use(handleValidationErrors);

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
app.get('/health', async (req, res) => {
  try {
    // const sheetsConnected = await testConnection();
    
    res.json({
      success: true,
      status: 'OK',
      database: 'Test Mode - No Google Sheets',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
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
const startServer = async () => {
  try {
    // Testar conexão com Google Sheets (desabilitado para teste)
    console.log('🔍 Modo de teste ativado - Google Sheets desabilitado');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('🚀 Servidor iniciado com sucesso!');
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Banco de dados: Test Mode - Sem Google Sheets`);
      console.log('📚 Documentação da API:');
      console.log(`   - POST /api/auth/register - Cadastro de usuário`);
      console.log(`   - POST /api/auth/login - Login de usuário`);
      console.log(`   - GET  /api/products - Listar produtos`);
      console.log(`   - GET  /api/products/featured - Produtos em destaque`);
      console.log('🍰 Doce Sensações API está pronta para testes!');
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer(); 