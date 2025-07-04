const { google } = require('googleapis');
require('dotenv').config();

// Configuração da autenticação Google
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Instância do Google Sheets
const sheets = google.sheets({ version: 'v4', auth });

// ID da planilha
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

// Nomes das abas (sheets)
const SHEETS = {
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  ORDER_ITEMS: 'order_items',
  REVIEWS: 'reviews',
  COUPONS: 'coupons',
  CART: 'shopping_cart'
};

// Headers das colunas para cada aba
const HEADERS = {
  USERS: ['id', 'name', 'email', 'password_hash', 'phone', 'user_type', 'loyalty_points', 'total_orders', 'avatar_url', 'is_active', 'created_at', 'updated_at'],
  PRODUCTS: ['id', 'category_id', 'name', 'description', 'price', 'original_price', 'discount_percentage', 'image_url', 'stock_quantity', 'is_featured', 'is_active', 'created_at', 'updated_at'],
  CATEGORIES: ['id', 'name', 'description', 'image_url', 'is_active', 'created_at'],
  ORDERS: ['id', 'user_id', 'order_number', 'status', 'subtotal', 'discount_amount', 'delivery_fee', 'total_amount', 'payment_method', 'payment_status', 'delivery_notes', 'estimated_delivery', 'created_at', 'updated_at'],
  ORDER_ITEMS: ['id', 'order_id', 'product_id', 'quantity', 'unit_price', 'total_price', 'notes'],
  REVIEWS: ['id', 'user_id', 'order_id', 'product_id', 'rating', 'comment', 'is_public', 'created_at'],
  COUPONS: ['id', 'code', 'description', 'discount_type', 'discount_value', 'min_order_value', 'max_uses', 'current_uses', 'valid_from', 'valid_until', 'is_active', 'created_at'],
  CART: ['id', 'user_id', 'product_id', 'quantity', 'added_at']
};

// Função para testar conexão
async function testConnection() {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    
    console.log('✅ Conexão com Google Sheets estabelecida com sucesso!');
    console.log(`📊 Planilha: ${response.data.properties.title}`);
    console.log(`📋 Abas disponíveis: ${response.data.sheets.map(sheet => sheet.properties.title).join(', ')}`);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com Google Sheets:', error.message);
    return false;
  }
}

// Função para ler dados de uma aba
async function readSheet(sheetName, range = 'A:Z') {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || null;
      });
      return obj;
    });

    return data;
  } catch (error) {
    console.error(`Erro ao ler aba ${sheetName}:`, error);
    throw error;
  }
}

// Função para escrever dados em uma aba
async function writeSheet(sheetName, data, range = 'A:Z') {
  try {
    const headers = HEADERS[sheetName.toUpperCase()];
    const rows = [headers];

    if (Array.isArray(data)) {
      // Múltiplas linhas
      data.forEach(item => {
        const row = headers.map(header => item[header] || '');
        rows.push(row);
      });
    } else {
      // Uma linha
      const row = headers.map(header => data[header] || '');
      rows.push(row);
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!${range}`,
      valueInputOption: 'RAW',
      resource: {
        values: rows,
      },
    });

    return true;
  } catch (error) {
    console.error(`Erro ao escrever na aba ${sheetName}:`, error);
    throw error;
  }
}

// Função para adicionar uma linha
async function appendRow(sheetName, data) {
  try {
    const headers = HEADERS[sheetName.toUpperCase()];
    const row = headers.map(header => data[header] || '');

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [row],
      },
    });

    return true;
  } catch (error) {
    console.error(`Erro ao adicionar linha na aba ${sheetName}:`, error);
    throw error;
  }
}

// Função para atualizar uma linha específica
async function updateRow(sheetName, rowIndex, data) {
  try {
    const headers = HEADERS[sheetName.toUpperCase()];
    const row = headers.map(header => data[header] || '');

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${rowIndex}:Z${rowIndex}`,
      valueInputOption: 'RAW',
      resource: {
        values: [row],
      },
    });

    return true;
  } catch (error) {
    console.error(`Erro ao atualizar linha na aba ${sheetName}:`, error);
    throw error;
  }
}

// Função para deletar uma linha (marcar como inativa)
async function deleteRow(sheetName, rowIndex) {
  try {
    // Para soft delete, apenas marcar como inativa
    const data = { is_active: 'FALSE' };
    return await updateRow(sheetName, rowIndex, data);
  } catch (error) {
    console.error(`Erro ao deletar linha na aba ${sheetName}:`, error);
    throw error;
  }
}

// Função para buscar por ID
async function findById(sheetName, id) {
  try {
    const data = await readSheet(sheetName);
    return data.find(item => item.id == id);
  } catch (error) {
    console.error(`Erro ao buscar por ID na aba ${sheetName}:`, error);
    throw error;
  }
}

// Função para buscar por campo específico
async function findByField(sheetName, field, value) {
  try {
    const data = await readSheet(sheetName);
    return data.filter(item => item[field] == value);
  } catch (error) {
    console.error(`Erro ao buscar por campo na aba ${sheetName}:`, error);
    throw error;
  }
}

// Função para gerar ID único
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

module.exports = {
  sheets,
  SHEETS,
  HEADERS,
  testConnection,
  readSheet,
  writeSheet,
  appendRow,
  updateRow,
  deleteRow,
  findById,
  findByField,
  generateId
}; 