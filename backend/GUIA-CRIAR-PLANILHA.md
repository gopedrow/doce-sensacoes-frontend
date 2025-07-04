# 📊 Como Criar Planilha Google Sheets

## 🚀 **Passo 1: Criar Nova Planilha**

1. **No Google Sheets** (já aberto)
2. **Clique no botão "+"** (canto superior esquerdo)
3. **Uma nova planilha será criada**

## 📝 **Passo 2: Renomear Planilha**

1. **No canto superior esquerdo**, clique no nome "Planilha sem título"
2. **Digite:** `Doce Sensações - Database`
3. **Pressione Enter**

## 🔗 **Passo 3: Copiar URL da Planilha**

1. **Na barra de endereços**, copie a URL completa:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit#gid=0
   ```

2. **Extraia o ID** (parte entre /d/ e /edit):
   ```
   https://docs.google.com/spreadsheets/d/1ABC123DEF456GHI789JKL/edit#gid=0
                                    ↑
                              Este é o ID
   ```

## 👥 **Passo 4: Compartilhar com Service Account**

1. **Clique no botão "Compartilhar"** (canto superior direito)
2. **Clique em "Adicionar pessoas"**
3. **No campo de email**, digite:
   ```
   doce-sensacoes-backend-1d3699a668c5@doce-sensacoes-backend.iam.gserviceaccount.com
   ```
4. **Permissão:** Selecione "Editor"
5. **Desmarque:** "Notificar pessoas"
6. **Clique em "Enviar"**

## 📋 **Passo 5: Criar Abas da Planilha**

### **Aba 1: users**
1. **Clique no "+"** (aba inferior)
2. **Renomeie para:** `users`
3. **Adicione os cabeçalhos:**
   ```
   A1: id
   B1: name
   C1: email
   D1: password_hash
   E1: user_type
   F1: is_active
   G1: created_at
   ```

### **Aba 2: products**
1. **Clique no "+"** (aba inferior)
2. **Renomeie para:** `products`
3. **Adicione os cabeçalhos:**
   ```
   A1: id
   B1: name
   C1: description
   D1: price
   E1: category_id
   F1: image_url
   G1: is_featured
   H1: is_active
   I1: created_at
   ```

### **Aba 3: categories**
1. **Clique no "+"** (aba inferior)
2. **Renomeie para:** `categories`
3. **Adicione os cabeçalhos:**
   ```
   A1: id
   B1: name
   C1: description
   D1: is_active
   E1: created_at
   ```

### **Aba 4: orders**
1. **Clique no "+"** (aba inferior)
2. **Renomeie para:** `orders`
3. **Adicione os cabeçalhos:**
   ```
   A1: id
   B1: user_id
   C1: total_amount
   D1: status
   E1: created_at
   ```

### **Aba 5: order_items**
1. **Clique no "+"** (aba inferior)
2. **Renomeie para:** `order_items`
3. **Adicione os cabeçalhos:**
   ```
   A1: id
   B1: order_id
   C1: product_id
   D1: quantity
   E1: price
   ```

## 📊 **Passo 6: Adicionar Dados de Exemplo**

### **Na aba "users":**
```
A2: 1
B2: Admin
C2: admin@doce.com
D2: $2b$10$hash123
E2: admin
F2: TRUE
G2: 2024-01-01
```

### **Na aba "categories":**
```
A2: 1
B2: Bolos
C2: Bolos artesanais
D2: TRUE
E2: 2024-01-01
```

### **Na aba "products":**
```
A2: 1
B2: Bolo de Chocolate
C2: Delicioso bolo de chocolate artesanal
D2: 45.00
E2: 1
F2: https://exemplo.com/bolo.jpg
G2: TRUE
H2: TRUE
I2: 2024-01-01
```

## ✅ **Passo 7: Verificar Configuração**

1. **Verifique se todas as abas foram criadas**
2. **Confirme se os cabeçalhos estão corretos**
3. **Teste se consegue editar células**
4. **Salve a planilha** (Ctrl+S ou Cmd+S)

---

## 🎯 **Próximo Passo:**

Após criar a planilha:
1. **Copie o ID** da planilha
2. **Configure o arquivo .env**
3. **Teste a conexão**

---

## 📞 **Precisa de ajuda?**

Se não conseguir encontrar alguma opção ou tiver algum erro, me avise! Vou te ajudar a resolver! 🍰 