const express = require('express');
const app = express();

app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Doce Sensações funcionando! 🍰',
    timestamp: new Date().toISOString()
  });
});

// Rota de produtos de teste
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    products: [
      {
        id: '1',
        name: 'Bolo de Chocolate',
        description: 'Delicioso bolo artesanal',
        price: '45.00',
        is_featured: true
      },
      {
        id: '2',
        name: 'Brigadeiro Gourmet',
        description: 'Caixa com 6 brigadeiros',
        price: '18.00',
        is_featured: true
      }
    ]
  });
});

// Rota de login de teste
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@teste.com' && password === '123456') {
    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token: 'teste_token_123',
      user: {
        id: '1',
        name: 'Admin Teste',
        email: 'admin@teste.com'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log('🚀 Servidor de teste iniciado!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log('📚 Teste as rotas:');
  console.log('   - GET  /');
  console.log('   - GET  /api/products');
  console.log('   - POST /api/auth/login');
  console.log('🍰 Doce Sensações está funcionando!');
}).on('error', (err) => {
  console.error('❌ Erro ao iniciar servidor:', err.message);
}); 