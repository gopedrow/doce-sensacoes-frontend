const { readSheet, appendRow, updateRow, deleteRow, findByField, generateId } = require('../config/googleSheets');

// Buscar todos os produtos
const getAllProducts = async (req, res) => {
  try {
    const { category, featured, search, limit = 50, offset = 0 } = req.query;

    // Buscar todos os produtos
    let products = await readSheet('products');

    // Filtrar produtos ativos
    products = products.filter(product => product.is_active === 'TRUE');

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

    // Buscar categorias para incluir nomes
    const categories = await readSheet('categories');
    const categoriesMap = {};
    categories.forEach(cat => {
      categoriesMap[cat.id] = cat.name;
    });

    // Adicionar nome da categoria aos produtos
    products = products.map(product => ({
      ...product,
      category_name: categoriesMap[product.category_id] || 'Sem categoria'
    }));

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
      products: paginatedProducts,
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

    // Buscar produtos em destaque
    let products = await readSheet('products');
    products = products.filter(product => 
      product.is_active === 'TRUE' && product.is_featured === 'TRUE'
    );

    // Buscar categorias
    const categories = await readSheet('categories');
    const categoriesMap = {};
    categories.forEach(cat => {
      categoriesMap[cat.id] = cat.name;
    });

    // Adicionar nome da categoria e ordenar por data
    products = products.map(product => ({
      ...product,
      category_name: categoriesMap[product.category_id] || 'Sem categoria'
    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Limitar quantidade
    products = products.slice(0, parseInt(limit));

    res.json({
      success: true,
      products
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

    // Buscar produto
    const products = await findByField('products', 'id', id);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const product = products[0];

    // Verificar se produto está ativo
    if (product.is_active !== 'TRUE') {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Buscar categoria
    const categories = await findByField('categories', 'id', product.category_id);
    if (categories.length > 0) {
      product.category_name = categories[0].name;
    }

    // Buscar avaliações do produto
    const reviews = await findByField('reviews', 'product_id', id);
    const publicReviews = reviews.filter(review => review.is_public === 'TRUE');

    // Buscar dados dos usuários que fizeram as avaliações
    const users = await readSheet('users');
    const usersMap = {};
    users.forEach(user => {
      usersMap[user.id] = user.name;
    });

    // Adicionar nomes dos usuários às avaliações
    const reviewsWithUsers = publicReviews.map(review => ({
      ...review,
      user_name: usersMap[review.user_id] || 'Usuário anônimo'
    })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    product.reviews = reviewsWithUsers.slice(0, 10); // Limitar a 10 avaliações

    res.json({
      success: true,
      product
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
    const categories = await readSheet('categories');
    const activeCategories = categories.filter(cat => cat.is_active === 'TRUE');

    res.json({
      success: true,
      categories: activeCategories
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
    const categories = await findByField('categories', 'id', category_id);
    if (categories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Categoria não encontrada'
      });
    }

    // Gerar ID único
    const productId = generateId();

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

    // Adicionar produto à planilha
    await appendRow('products', productData);

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

    // Verificar se produto existe
    const existingProducts = await findByField('products', 'id', id);
    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    const currentProduct = existingProducts[0];

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
      const categories = await findByField('categories', 'id', category_id);
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

    // Encontrar índice da linha na planilha
    const allProducts = await readSheet('products');
    const rowIndex = allProducts.findIndex(product => product.id === id) + 2; // +2 porque planilha começa em 1 e tem header

    // Atualizar produto na planilha
    await updateRow('products', rowIndex, updateData);

    // Buscar categoria para incluir na resposta
    const categories = await findByField('categories', 'id', updateData.category_id);
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

    // Verificar se produto existe
    const existingProducts = await findByField('products', 'id', id);
    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    // Encontrar índice da linha na planilha
    const allProducts = await readSheet('products');
    const rowIndex = allProducts.findIndex(product => product.id === id) + 2;

    // Soft delete - apenas desativar
    const currentProduct = existingProducts[0];
    const updateData = {
      ...currentProduct,
      is_active: 'FALSE',
      updated_at: new Date().toISOString()
    };

    await updateRow('products', rowIndex, updateData);

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