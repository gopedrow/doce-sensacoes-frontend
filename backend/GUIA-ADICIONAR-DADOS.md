# 📊 Como Adicionar Dados na Planilha

## ✅ **Status Atual:**
- ✅ Planilha criada e configurada
- ✅ Backend conectado e funcionando
- ✅ APIs respondendo corretamente
- ✅ Frontend conectado às APIs

## 🚀 **Agora vamos adicionar dados reais!**

### **1. Adicionar Categorias (Aba `categories`)**

Primeiro, adicione as categorias dos seus produtos:

| id | name | description | is_active | created_at |
|----|------|-------------|-----------|------------|
| 1 | Bolos | Bolos artesanais personalizados | TRUE | 2024-01-01 |
| 2 | Doces | Doces finos e brigadeiros | TRUE | 2024-01-01 |
| 3 | Tortas | Tortas especiais para festas | TRUE | 2024-01-01 |
| 4 | Cupcakes | Cupcakes decorados | TRUE | 2024-01-01 |

### **2. Adicionar Produtos (Aba `products`)**

Agora adicione seus produtos reais:

| id | name | description | price | category_id | image_url | is_featured | is_active | created_at |
|----|------|-------------|-------|-------------|-----------|-------------|-----------|------------|
| 1 | Bolo de Chocolate | Delicioso bolo de chocolate artesanal com cobertura cremosa | 45.00 | 1 | https://exemplo.com/bolo-chocolate.jpg | TRUE | TRUE | 2024-01-01 |
| 2 | Brigadeiro Gourmet | Caixa com 6 brigadeiros especiais | 18.00 | 2 | https://exemplo.com/brigadeiro.jpg | TRUE | TRUE | 2024-01-01 |
| 3 | Torta de Morango | Torta fresca com morangos da estação | 35.00 | 3 | https://exemplo.com/torta-morango.jpg | TRUE | TRUE | 2024-01-01 |
| 4 | Cupcake de Baunilha | Cupcake fofinho com cobertura colorida | 8.50 | 4 | https://exemplo.com/cupcake.jpg | FALSE | TRUE | 2024-01-01 |

### **3. Adicionar Usuário Admin (Aba `users`)**

Crie um usuário administrador:

| id | name | email | password_hash | user_type | is_active | created_at |
|----|------|-------|---------------|-----------|-----------|------------|
| 1 | Admin | admin@doce.com | $2b$10$hash123 | admin | TRUE | 2024-01-01 |

**Para gerar senha hash real:**
```bash
# No terminal, execute:
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('123456', 10));"
```

### **4. Exemplo de Dados Reais para Doce Sensações**

#### **Categorias:**
```
1 | Bolos | Bolos artesanais personalizados | TRUE | 2024-01-01
2 | Doces | Doces finos e brigadeiros | TRUE | 2024-01-01
3 | Tortas | Tortas especiais para festas | TRUE | 2024-01-01
4 | Cupcakes | Cupcakes decorados | TRUE | 2024-01-01
5 | Brownies | Brownies caseiros | TRUE | 2024-01-01
```

#### **Produtos:**
```
1 | Bolo de Chocolate | Delicioso bolo de chocolate artesanal | 45.00 | 1 | src/images/dish.png | TRUE | TRUE | 2024-01-01
2 | Brigadeiro Gourmet | Caixa com 6 brigadeiros especiais | 18.00 | 2 | src/images/dish2.png | TRUE | TRUE | 2024-01-01
3 | Cento de Docinhos | Variedade deliciosa para festas | 100.00 | 2 | src/images/dish3.png | TRUE | TRUE | 2024-01-01
4 | Brownie | Chocolate intenso com casquinha crocante | 10.00 | 5 | src/images/dish4.png | TRUE | TRUE | 2024-01-01
5 | Cupcake de Baunilha | Massa fofinha com cobertura cremosa | 8.50 | 4 | src/images/dish.png | FALSE | TRUE | 2024-01-01
6 | Torta de Morango | Torta fresca com morangos | 35.00 | 3 | src/images/dish2.png | TRUE | TRUE | 2024-01-01
```

## 🔄 **Como Testar:**

### **1. Testar APIs:**
```bash
# Listar produtos
curl http://localhost:3001/api/products

# Listar categorias
curl http://localhost:3001/api/products/categories

# Produtos em destaque
curl http://localhost:3001/api/products/featured
```

### **2. Testar Frontend:**
1. Abra `index.html` no navegador
2. Vá para a seção "Cardápio"
3. Os produtos da planilha devem aparecer automaticamente

### **3. Testar Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@doce.com","password":"123456"}'
```

## 📝 **Dicas Importantes:**

### **Para Imagens:**
- Use URLs de imagens reais ou mantenha `src/images/dish.png`
- Para imagens locais, coloque o caminho relativo
- Para imagens online, use URLs completas

### **Para Preços:**
- Use formato decimal: `45.00` (não `45,00`)
- O frontend converte automaticamente para formato brasileiro

### **Para Status:**
- Use `TRUE` ou `FALSE` (em maiúsculo)
- `is_active`: controla se o produto aparece no site
- `is_featured`: controla se aparece em destaque

## 🎯 **Próximos Passos:**

1. **Adicione seus produtos reais** na planilha
2. **Teste o frontend** para ver se aparecem
3. **Configure imagens** dos produtos
4. **Teste o sistema de login**

## 📞 **Precisa de ajuda?**

Se tiver dúvidas sobre:
- Como adicionar dados específicos
- Como configurar imagens
- Como testar as funcionalidades
- Como personalizar mais

Me avise! Vou te ajudar! 🍰 