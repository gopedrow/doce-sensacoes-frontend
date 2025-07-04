# 🍰 Guia Completo - Configurar Google Sheets

## 🔑 O que é o arquivo JSON de credenciais?

É uma "chave digital" que permite nossa aplicação acessar o Google Sheets automaticamente. Contém:
- Email da Service Account
- Chave privada criptografada
- Informações do projeto Google Cloud

---

## 📋 Passo a Passo Completo

### **Passo 1: Criar Projeto no Google Cloud Console**

1. **Acesse:** https://console.cloud.google.com/
2. **Faça login** com sua conta Google
3. **Clique em "Selecionar projeto"** (canto superior esquerdo)
4. **Clique em "Novo projeto"**
5. **Nome do projeto:** `Doce Sensações Backend`
6. **Clique em "Criar"**

### **Passo 2: Ativar Google Sheets API**

1. **No menu lateral esquerdo**, clique em "APIs e serviços" > "Biblioteca"
2. **Pesquise por:** "Google Sheets API"
3. **Clique na "Google Sheets API"**
4. **Clique em "Ativar"**

### **Passo 3: Criar Service Account**

1. **No menu lateral**, clique em "APIs e serviços" > "Credenciais"
2. **Clique em "Criar credenciais"** > "Conta de serviço"
3. **Nome da conta de serviço:** `doce-sensacoes-api`
4. **Descrição:** `API para sistema Doce Sensações`
5. **Clique em "Criar e continuar"**
6. **Role:** Selecione "Editor"
7. **Clique em "Continuar"**
8. **Clique em "Concluído"**

### **Passo 4: Baixar arquivo JSON**

1. **Na lista de contas de serviço**, clique na que você criou
2. **Vá para a aba "Chaves"**
3. **Clique em "Adicionar chave"** > "Criar nova chave"
4. **Tipo de chave:** JSON
5. **Clique em "Criar"**
6. **O arquivo será baixado automaticamente**

### **Passo 5: Criar Planilha Google Sheets**

1. **Acesse:** https://sheets.google.com/
2. **Clique em "+"** para criar nova planilha
3. **Nome:** `Doce Sensações - Database`
4. **Clique em "Compartilhar"** (canto superior direito)
5. **Adicione o email da Service Account** (está no arquivo JSON)
6. **Permissão:** Editor
7. **Clique em "Enviar"**

### **Passo 6: Copiar ID da Planilha**

1. **Na URL da planilha**, copie o ID:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123...XYZ/edit
                                    ↑
                              Este é o ID
   ```

---

## 📁 Estrutura da Planilha

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

### **Aba 4: orders**
| id | user_id | total_amount | status | created_at |
|----|---------|--------------|--------|------------|
| 1  | 1 | 45.00 | pending | 2024-01-01 |

### **Aba 5: order_items**
| id | order_id | product_id | quantity | price |
|----|----------|------------|----------|-------|
| 1  | 1 | 1 | 1 | 45.00 |

---

## 🔧 Configuração no Backend

### **Passo 7: Mover arquivo JSON**

1. **Mova o arquivo baixado** para a pasta `backend/`
2. **Renomeie para:** `google-credentials.json`

### **Passo 8: Configurar variáveis**

1. **Crie arquivo `.env`** na pasta `backend/`:

```env
# Google Sheets
GOOGLE_SHEETS_ID=1ABC123...XYZ
GOOGLE_CREDENTIALS_FILE=google-credentials.json

# Servidor
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=doce_sensacoes_jwt_secret_key_2024
JWT_EXPIRES_IN=7d
```

### **Passo 9: Testar configuração**

```bash
cd backend
npm run dev
```

---

## ✅ Checklist de Verificação

- [ ] Projeto criado no Google Cloud Console
- [ ] Google Sheets API ativada
- [ ] Service Account criada
- [ ] Arquivo JSON baixado
- [ ] Planilha criada e compartilhada
- [ ] ID da planilha copiado
- [ ] Arquivo JSON movido para backend/
- [ ] Arquivo .env configurado
- [ ] Servidor testado

---

## 🚨 Importante!

- **NUNCA compartilhe** o arquivo JSON de credenciais
- **NUNCA commite** o arquivo no Git
- **Mantenha backup** do arquivo em local seguro
- **Use .env** para configurações sensíveis

---

## 📞 Precisa de ajuda?

Se ficar em dúvida em qualquer etapa, me avise! Vou te ajudar a resolver! 🍰 