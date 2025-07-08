const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Dados mock para pedidos
const mockOrders = [
  {
    id: '1',
    user_id: 1,
    status: 'pending',
    total: 45.00,
    items: [
      {
        product_id: '1',
        name: 'Bolo de Chocolate',
        price: 45.00,
        quantity: 1
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: 1,
    status: 'delivered',
    total: 80.00,
    items: [
      {
        product_id: '2',
        name: 'Torta de Limão',
        price: 38.00,
        quantity: 1
      },
      {
        product_id: '3',
        name: 'Brigadeiro Gourmet',
        price: 18.00,
        quantity: 1
      }
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
    updated_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Validações para criação de pedidos
const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Pedido deve ter pelo menos um item'),
  body('items.*.product_id')
    .notEmpty()
    .withMessage('ID do produto é obrigatório'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser maior que zero')
];

// Buscar pedidos do usuário
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const userOrders = mockOrders.filter(order => order.user_id === userId);
    
    res.json({
      success: true,
      data: userOrders
    });
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Criar novo pedido
const createOrder = async (req, res) => {
  try {
    const { items, delivery_address, payment_method } = req.body;
    const userId = req.user.id;
    
    // Calcular total
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Criar pedido mock
    const newOrder = {
      id: (mockOrders.length + 1).toString(),
      user_id: userId,
      status: 'pending',
      total: total,
      items: items,
      delivery_address: delivery_address || 'Endereço padrão',
      payment_method: payment_method || 'cartão',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockOrders.push(newOrder);
    
    res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso!',
      data: newOrder
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar pedido por ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const order = mockOrders.find(o => o.id === id && o.user_id === userId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido não encontrado'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Rotas
router.get('/', authenticateToken, getUserOrders);
router.post('/create', authenticateToken, orderValidation, createOrder);
router.get('/:id', authenticateToken, getOrderById);

module.exports = router; 