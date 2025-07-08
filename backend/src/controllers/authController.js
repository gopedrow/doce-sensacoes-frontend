// MOCK AUTH CONTROLLER PARA TESTE LOCAL

// Gerar token mock
const generateToken = (userId) => {
  return 'mock-jwt-token-' + userId;
};

// Usuário de teste
const mockUser = {
  id: 1,
  name: 'Usuário Teste',
  email: 'teste@teste.com',
  user_type: 'cliente',
  phone: '(62) 99999-9999',
  loyalty_points: 10,
  total_orders: 2,
  avatar_url: '',
  is_active: 'TRUE',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Cadastro de usuário (mock)
const register = async (req, res) => {
  return res.status(201).json({
    success: true,
    message: 'Usuário cadastrado com sucesso! (mock)',
    token: generateToken(mockUser.id),
    user: mockUser
  });
};

// Login de usuário (mock)
const login = async (req, res) => {
  const { email, password } = req.body;
  if (email === 'teste@teste.com' && password === '123456') {
    return res.json({
      success: true,
      message: 'Login realizado com sucesso! (mock)',
      token: generateToken(mockUser.id),
      user: mockUser
    });
  } else {
    return res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos (mock)'
    });
  }
};

// Perfil do usuário (mock)
const getProfile = async (req, res) => {
  return res.json({
    success: true,
    user: mockUser
  });
};

// Atualizar perfil (mock)
const updateProfile = async (req, res) => {
  return res.json({
    success: true,
    message: 'Perfil atualizado com sucesso! (mock)',
    user: mockUser
  });
};

// Logout (mock)
const logout = async (req, res) => {
  return res.json({
    success: true,
    message: 'Logout realizado com sucesso! (mock)'
  });
};

// Social login (mock)
const googleLogin = async (req, res) => {
  return login(req, res);
};
const facebookLogin = async (req, res) => {
  return login(req, res);
};

module.exports = {
  register,
  login,
  googleLogin,
  facebookLogin,
  getProfile,
  updateProfile,
  logout
}; 