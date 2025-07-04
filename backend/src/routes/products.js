const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validações para criação/atualização de produtos
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  body('price')
    .isFloat({ min: 0.01 })
    .withMessage('Preço deve ser maior que zero'),
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Categoria é obrigatória'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Descrição deve ter no máximo 1000 caracteres'),
  body('stock_quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantidade em estoque deve ser um número inteiro não negativo'),
  body('discount_percentage')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Desconto deve ser entre 0 e 100%'),
  body('is_featured')
    .optional()
    .isBoolean()
    .withMessage('Destaque deve ser true ou false'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('Status ativo deve ser true ou false')
];

// Rotas públicas
router.get('/', optionalAuth, productController.getAllProducts);
router.get('/featured', optionalAuth, productController.getFeaturedProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', optionalAuth, productController.getProductById);

// Rotas administrativas (requerem autenticação e permissão de admin)
router.post('/', authenticateToken, requireAdmin, productValidation, productController.createProduct);
router.put('/:id', authenticateToken, requireAdmin, productValidation, productController.updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, productController.deleteProduct);

module.exports = router; 