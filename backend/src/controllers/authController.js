const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readSheet, appendRow, updateRow, findByField, generateId } = require('../config/googleSheets');

// Gerar token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Cadastro de usuário
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verificar se email já existe
    const existingUsers = await findByField('users', 'email', email);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está cadastrado'
      });
    }

    // Criptografar senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Gerar ID único
    const userId = generateId();

    // Preparar dados do usuário
    const userData = {
      id: userId,
      name,
      email,
      password_hash: hashedPassword,
      phone: phone || '',
      user_type: 'client',
      loyalty_points: '0',
      total_orders: '0',
      avatar_url: '',
      is_active: 'TRUE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Adicionar usuário à planilha
    await appendRow('users', userData);

    // Remover senha do objeto de resposta
    delete userData.password_hash;

    // Gerar token
    const token = generateToken(userId);

    res.status(201).json({
      success: true,
      message: 'Usuário cadastrado com sucesso!',
      token,
      user: userData
    });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Login de usuário
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validações básicas
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const users = await findByField('users', 'email', email);

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    const user = users[0];

    // Verificar se usuário está ativo
    if (user.is_active !== 'TRUE') {
      return res.status(401).json({
        success: false,
        message: 'Conta desativada. Entre em contato com o suporte.'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha incorretos'
      });
    }

    // Remover senha do objeto
    delete user.password_hash;

    // Gerar token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      token,
      user
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar perfil do usuário
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const users = await findByField('users', 'id', userId);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const user = users[0];
    delete user.password_hash;

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar perfil do usuário
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, password } = req.body;

    // Validações básicas
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nome e email são obrigatórios'
      });
    }

    // Verificar se email já existe (exceto para o usuário atual)
    const existingUsers = await findByField('users', 'email', email);
    const emailExists = existingUsers.some(user => user.id !== userId);

    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Este email já está sendo usado por outro usuário'
      });
    }

    // Buscar usuário atual
    const currentUsers = await findByField('users', 'id', userId);
    if (currentUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    const currentUser = currentUsers[0];

    // Preparar dados para atualização
    const updateData = {
      ...currentUser,
      name,
      email,
      phone: phone || '',
      updated_at: new Date().toISOString()
    };

    // Se senha foi fornecida, criptografar e adicionar
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A senha deve ter pelo menos 6 caracteres'
        });
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.password_hash = hashedPassword;
    }

    // Encontrar índice da linha na planilha
    const allUsers = await readSheet('users');
    const rowIndex = allUsers.findIndex(user => user.id === userId) + 2; // +2 porque planilha começa em 1 e tem header

    // Atualizar usuário na planilha
    await updateRow('users', rowIndex, updateData);

    // Remover senha do objeto de resposta
    delete updateData.password_hash;

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso!',
      user: updateData
    });

  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Logout (opcional - token é invalidado no frontend)
const logout = async (req, res) => {
  try {
    // Em uma implementação mais robusta, você poderia adicionar o token
    // a uma blacklist no Redis ou banco de dados
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  logout
}; 