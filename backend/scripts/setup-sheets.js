#!/usr/bin/env node

const { sheets, SHEETS, HEADERS, testConnection } = require('../src/config/googleSheets');

console.log('🍰 Configurando estrutura da planilha Google Sheets...\n');

async function setupSheets() {
  try {
    // Testar conexão
    console.log('🔍 Testando conexão com Google Sheets...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('❌ Não foi possível conectar com o Google Sheets');
      console.log('💡 Execute primeiro: npm run auth');
      process.exit(1);
    }

    console.log('✅ Conexão estabelecida!\n');

    // Criar estrutura das abas
    for (const [sheetName, headers] of Object.entries(HEADERS)) {
      console.log(`📋 Configurando aba: ${SHEETS[sheetName.toUpperCase()]}`);
      
      try {
        // Criar cabeçalhos
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEETS_ID,
          range: `${SHEETS[sheetName.toUpperCase()]}!A1:${String.fromCharCode(65 + headers.length - 1)}1`,
          valueInputOption: 'RAW',
          resource: {
            values: [headers]
          }
        });

        // Formatar cabeçalhos (negrito)
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: process.env.GOOGLE_SHEETS_ID,
          resource: {
            requests: [
              {
                repeatCell: {
                  range: {
                    sheetId: await getSheetId(SHEETS[sheetName.toUpperCase()]),
                    startRowIndex: 0,
                    endRowIndex: 1,
                    startColumnIndex: 0,
                    endColumnIndex: headers.length
                  },
                  cell: {
                    userEnteredFormat: {
                      textFormat: {
                        bold: true
                      },
                      backgroundColor: {
                        red: 0.9,
                        green: 0.9,
                        blue: 0.9
                      }
                    }
                  },
                  fields: 'userEnteredFormat(textFormat,backgroundColor)'
                }
              }
            ]
          }
        });

        console.log(`✅ Aba ${SHEETS[sheetName.toUpperCase()]} configurada`);

        // Adicionar dados iniciais se necessário
        if (sheetName === 'CATEGORIES') {
          await addInitialCategories();
        }

      } catch (error) {
        console.log(`⚠️  Erro ao configurar aba ${SHEETS[sheetName.toUpperCase()]}: ${error.message}`);
      }
    }

    console.log('\n🎉 Estrutura da planilha configurada com sucesso!');
    console.log('\n📊 Abas criadas:');
    Object.values(SHEETS).forEach(sheet => {
      console.log(`   - ${sheet}`);
    });

    console.log('\n📋 Próximos passos:');
    console.log('1. Verifique a planilha no Google Sheets');
    console.log('2. Execute: npm run dev');
    console.log('3. Teste a API: http://localhost:3000/api/products');

  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
  }
}

async function getSheetId(sheetName) {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_ID
    });
    
    const sheet = response.data.sheets.find(s => s.properties.title === sheetName);
    return sheet ? sheet.properties.sheetId : null;
  } catch (error) {
    console.error('Erro ao obter ID da aba:', error);
    return null;
  }
}

async function addInitialCategories() {
  try {
    const categories = [
      {
        id: 'cat1',
        name: 'Bolos',
        description: 'Bolos artesanais e personalizados',
        image_url: '',
        is_active: 'TRUE',
        created_at: new Date().toISOString()
      },
      {
        id: 'cat2',
        name: 'Doces',
        description: 'Doces finos e brigadeiros gourmet',
        image_url: '',
        is_active: 'TRUE',
        created_at: new Date().toISOString()
      },
      {
        id: 'cat3',
        name: 'Tortas',
        description: 'Tortas doces e salgadas',
        image_url: '',
        is_active: 'TRUE',
        created_at: new Date().toISOString()
      },
      {
        id: 'cat4',
        name: 'Cupcakes',
        description: 'Cupcakes decorados',
        image_url: '',
        is_active: 'TRUE',
        created_at: new Date().toISOString()
      },
      {
        id: 'cat5',
        name: 'Kits',
        description: 'Kits especiais e combos',
        image_url: '',
        is_active: 'TRUE',
        created_at: new Date().toISOString()
      }
    ];

    for (const category of categories) {
      const headers = HEADERS.CATEGORIES;
      const row = headers.map(header => category[header] || '');
      
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEETS_ID,
        range: `${SHEETS.CATEGORIES}!A:Z`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [row]
        }
      });
    }

    console.log('✅ Categorias iniciais adicionadas');

  } catch (error) {
    console.error('Erro ao adicionar categorias:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupSheets();
}

module.exports = { setupSheets }; 