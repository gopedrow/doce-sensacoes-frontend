// const { readSheet, appendRow, updateRow, deleteRow, findByField, generateId } = require('../config/googleSheets');

// Dados mock para teste
const mockProducts = [
  {
    id: '1',
    name: 'Bolo de Chocolate',
    description: 'Massa fofinha, recheio cremoso e cobertura de chocolate belga.',
    price: '45.00',
    img: 'assets/images/dish.png',
    category_id: '1',
    category_name: 'Bolos',
    stock_quantity: '10',
    is_featured: 'TRUE',
    is_active: 'TRUE',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Torta de Limão',
    description: 'Base crocante, creme de limão e merengue maçaricado.',
    price: '38.00',
    img: 'assets/images/dish2.png',
    category_id: '2',
    category_name: 'Tortas',
    stock_quantity: '8',
    is_featured: 'TRUE',
    is_active: 'TRUE',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Brigadeiro Gourmet',
    description: 'Caixa com 6 unidades de brigadeiro feito com chocolate premium.',
    price: '18.00',
    img: 'assets/images/dish3.png',
    category_id: '3',
    category_name: 'Doces',
    stock_quantity: '20',
    is_featured: 'TRUE',
    is_active: 'TRUE',
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Cheesecake de Frutas Vermelhas',
    description: 'Cremoso, com calda artesanal de frutas vermelhas.',
    price: '42.00',
    img: 'assets/images/dish4.png',
    category_id: '4',
    category_name: 'Cheesecakes',
    stock_quantity: '6',
    is_featured: 'TRUE',
    is_active: 'TRUE',
    created_at: new Date().toISOString()
  }
];

// Buscar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const { category, featured, search, limit = 50, offset = 0 } = req.query;

    // Usar dados mock para teste
    let products = [...mockProducts];

    // Aplicar filtros
    if (category) {
      products = products.filter(product => product.category_id === category);
    }

    if (featured === 'true') {
      products = products.filter(product => product.is_featured === 'TRUE');
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    // Ordenar (destaque primeiro, depois por data de criação)
    products.sort((a, b) => {
      if (a.is_featured === 'TRUE' && b.is_featured !== 'TRUE') return -1;
      if (a.is_featured !== 'TRUE' && b.is_featured === 'TRUE') return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

    // Paginação
    const total = products.length;
    const paginatedProducts = products.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar produtos em destaque
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Usar dados mock para teste
    let products = mockProducts.filter(product => product.is_featured === 'TRUE');

    // Ordenar por data
    products = products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Limitar quantidade
    products = products.slice(0, parseInt(limit));

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Erro ao buscar produtos em destaque:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar produto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar produto nos dados mock
    const product = mockProducts.find(p => p.id === id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Buscar categorias
const getCategories = async (req, res) => {
  try {
    const mockCategories = [
      { id: '1', name: 'Bolos', is_active: 'TRUE' },
      { id: '2', name: 'Tortas', is_active: 'TRUE' },
      { id: '3', name: 'Doces', is_active: 'TRUE' },
      { id: '4', name: 'Cheesecakes', is_active: 'TRUE' }
    ];

    res.json({
      success: true,
      data: mockCategories
    });

  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Criar produto (apenas admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      original_price,
      discount_percentage,
      category_id,
      stock_quantity,
      is_featured,
      image_url
    } = req.body;

    // Validações
    if (!name || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Nome, preço e categoria são obrigatórios'
      });
    }

    if (parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Preço deve ser maior que zero'
      });
    }

    // Verificar se categoria existe
    const categories = mockProducts.filter(p => p.id === category_id); // Assuming category_id is an ID from mockProducts
    if (categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    // Gerar ID único
    const productId = 'mock_' + Date.now(); // Simple mock ID generation

    // Preparar dados do produto
    const productData = {
      id: productId,
      category_id,
      name,
      description: description || '',
      price: price.toString(),
      original_price: (original_price || price).toString(),
      discount_percentage: (discount_percentage || 0).toString(),
      image_url: image_url || '',
      stock_quantity: (stock_quantity || 0).toString(),
      is_featured: is_featured ? 'TRUE' : 'FALSE',
      is_active: 'TRUE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Adicionar produto à planilha (mock)
    mockProducts.push(productData);

    // Buscar categoria para incluir na resposta
    const category = categories[0];
    productData.category_name = category.name;

    res.status(201).json({
      success: true,
      message: 'Produto criado com sucesso!',
      product: productData
    });

  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Atualizar produto (apenas admin)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      original_price,
      discount_percentage,
      category_id,
      stock_quantity,
      is_featured,
      image_url,
      is_active
    } = req.body;

    // Verificar se produto existe nos dados mock
    const existingProductIndex = mockProducts.findIndex(p => p.id === id);
    if (existingProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const currentProduct = mockProducts[existingProductIndex];

    // Validações
    if (name && name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Nome não pode estar vazio'
      });
    }

    if (price && parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Preço deve ser maior que zero'
      });
    }

    // Se categoria foi fornecida, verificar se existe
    if (category_id) {
      const categories = mockProducts.filter(p => p.id === category_id); // Assuming category_id is an ID from mockProducts
      if (categories.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Categoria não encontrada'
        });
      }
    }

    // Preparar dados para atualização
    const updateData = {
      ...currentProduct,
      name: name !== undefined ? name : currentProduct.name,
      description: description !== undefined ? description : currentProduct.description,
      price: price !== undefined ? price.toString() : currentProduct.price,
      original_price: original_price !== undefined ? original_price.toString() : currentProduct.original_price,
      discount_percentage: discount_percentage !== undefined ? discount_percentage.toString() : currentProduct.discount_percentage,
      category_id: category_id !== undefined ? category_id : currentProduct.category_id,
      stock_quantity: stock_quantity !== undefined ? stock_quantity.toString() : currentProduct.stock_quantity,
      is_featured: is_featured !== undefined ? (is_featured ? 'TRUE' : 'FALSE') : currentProduct.is_featured,
      image_url: image_url !== undefined ? image_url : currentProduct.image_url,
      is_active: is_active !== undefined ? (is_active ? 'TRUE' : 'FALSE') : currentProduct.is_active,
      updated_at: new Date().toISOString()
    };

    // Atualizar produto nos dados mock
    mockProducts[existingProductIndex] = updateData;

    // Buscar categoria para incluir na resposta
    const categories = mockProducts.filter(p => p.id === updateData.category_id); // Assuming category_id is an ID from mockProducts
    if (categories.length > 0) {
      updateData.category_name = categories[0].name;
    }

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso!',
      product: updateData
    });

  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

// Deletar produto (apenas admin)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se produto existe nos dados mock
    const existingProductIndex = mockProducts.findIndex(p => p.id === id);
    if (existingProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Remover produto dos dados mock
    mockProducts.splice(existingProductIndex, 1);

    res.json({
      success: true,
      message: 'Produto removido com sucesso!'
    });

  } catch (error) {
    console.error('Erro ao deletar produto:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  getAllProducts,
  getFeaturedProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct
}; 