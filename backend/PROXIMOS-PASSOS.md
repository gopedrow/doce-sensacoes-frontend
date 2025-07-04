# 🎉 Arquivo JSON Movido com Sucesso!

## ✅ **Status Atual:**
- ✅ Service Account criada
- ✅ Arquivo JSON baixado
- ✅ Arquivo movido para `backend/google-credentials.json`
- ✅ Configurações preparadas

## 🚀 **Próximos Passos:**

### **1. Criar Planilha Google Sheets**

1. **Acesse:** https://sheets.google.com/
2. **Clique em "+"** para criar nova planilha
3. **Nome:** `Doce Sensações - Database`
4. **Clique em "Compartilhar"** (canto superior direito)

### **2. Compartilhar Planilha com Service Account**

1. **No botão "Compartilhar"**, clique em "Adicionar pessoas"
2. **Email da Service Account:** (está no arquivo JSON)
   ```
   doce-sensacoes-backend-1d3699a668c5@doce-sensacoes-backend.iam.gserviceaccount.com
   ```
3. **Permissão:** Editor
4. **Clique em "Enviar"**

### **3. Copiar ID da Planilha**

1. **Na URL da planilha**, copie o ID:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123...XYZ/edit
                                    ↑
                              Este é o ID
   ```

### **4. Configurar Arquivo .env**

1. **Crie arquivo `.env`** na pasta `backend/`
2. **Copie o conteúdo** de `env-config.txt`
3. **Adicione o ID da planilha:**
   ```env
   GOOGLE_SHEETS_ID=1ABC123...XYZ
   ```

### **5. Testar Conexão**

```bash
cd backend
npm run dev
```

---

## 📋 **Estrutura da Planilha:**

Após configurar, a planilha terá estas abas:

### **Aba 1: users**
| id | name | email | password_hash | user_type | is_active | created_at |
|----|------|-------|---------------|-----------|-----------|------------|
| 1  | Admin | admin@doce.com | hash123 | admin | TRUE | 2024-01-01 |

### **Aba 2: products**
| id | name | description | price | category_id | image_url | is_featured | is_active | created_at |
|----|------|-------------|-------|-------------|-----------|-------------|-----------|------------|
| 1  | Bolo Chocolate | Delicioso bolo | 45.00 | 1 | url.jpg | TRUE | TRUE | 2024-01-01 |

### **Aba 3: categories**
| id | name | description | is_active | created_at |
|----|------|-------------|-----------|------------|
| 1  | Bolos | Bolos artesanais | TRUE | 2024-01-01 |

---

## 🎯 **Comandos Úteis:**

```bash
# Verificar se arquivo está no lugar certo
ls -la backend/google-credentials.json

# Criar arquivo .env
cp backend/env-config.txt backend/.env

# Testar servidor
cd backend
npm run dev
```

---

## 📞 **Precisa de ajuda?**

Se ficar em dúvida em qualquer etapa, me avise! Vou te ajudar a resolver! 🍰 