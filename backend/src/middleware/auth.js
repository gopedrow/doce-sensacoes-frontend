// Middleware de autenticação mock para testes locais
const authenticateToken = (req, res, next) => {
  // Sempre permite
  req.user = { id: 1, email: 'teste@teste.com', name: 'Usuário Teste', user_type: 'cliente' };
  next();
};

const requireAdmin = (req, res, next) => {
  // Sempre permite
  next();
};

const optionalAuth = (req, res, next) => {
  // Sempre permite
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
}; 