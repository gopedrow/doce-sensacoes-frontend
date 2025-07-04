# 🔑 Como Criar Service Account

## 📍 **Passo 1: Acessar Credenciais**

```
┌─────────────────────────────────────┐
│ Google Cloud Console                │
├─────────────────────────────────────┤
│ ☁️  Navegação                      │
│ ├── APIs e serviços                 │
│ │   ├── 📚 Biblioteca               │
│ │   ├── 🔑 Credenciais              │ ← CLIQUE AQUI
│ │   ├── 📊 Painel                   │
│ │   └── ⚙️  Configurações           │
│ └── ...                             │
└─────────────────────────────────────┘
```

## 🔧 **Passo 2: Criar Credenciais**

```
┌─────────────────────────────────────┐
│ Credenciais                         │
├─────────────────────────────────────┤
│                                     │
│ [Criar credenciais]                 │ ← CLIQUE AQUI
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Conta de serviço                │ │ ← SELECIONE ESTA
│ │ Chave de API                    │ │
│ │ ID do cliente OAuth 2.0         │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 📝 **Passo 3: Configurar Service Account**

```
┌─────────────────────────────────────┐
│ Criar conta de serviço              │
├─────────────────────────────────────┤
│                                     │
│ Nome da conta de serviço:           │
│ [doce-sensacoes-api]                │ ← DIGITE AQUI
│                                     │
│ Descrição da conta de serviço:      │
│ [API para sistema Doce Sensações]   │ ← DIGITE AQUI
│                                     │
│ [Criar e continuar]                 │ ← CLIQUE AQUI
└─────────────────────────────────────┘
```

## 🔐 **Passo 4: Conceder Acesso**

```
┌─────────────────────────────────────┐
│ Conceder acesso a esta conta de     │
│ serviço                             │
├─────────────────────────────────────┤
│                                     │
│ Role:                               │
│ [Editor]                            │ ← SELECIONE ESTA
│                                     │
│ [Continuar]                         │ ← CLIQUE AQUI
└─────────────────────────────────────┘
```

## ✅ **Passo 5: Finalizar**

```
┌─────────────────────────────────────┐
│ Revisar e criar                     │
├─────────────────────────────────────┤
│                                     │
│ ✅ Conta de serviço criada          │
│                                     │
│ [Concluído]                         │ ← CLIQUE AQUI
└─────────────────────────────────────┘
```

---

## 🎯 **O que você verá depois:**

Após criar, você verá uma lista com sua Service Account:
```
┌─────────────────────────────────────┐
│ Contas de serviço                   │
├─────────────────────────────────────┤
│                                     │
│ doce-sensacoes-api@projeto.iam...   │ ← SUA SERVICE ACCOUNT
│                                     │
│ [Gerenciar] [Editar] [Excluir]      │
└─────────────────────────────────────┘
```

---

## 🚨 **Possíveis Problemas:**

### **Problema 1: "Criar credenciais" não aparece**
**Solução:** Verifique se você está no projeto correto

### **Problema 2: Erro de permissão**
**Solução:** Você precisa ser proprietário ou editor do projeto

### **Problema 3: Nome já existe**
**Solução:** Use um nome diferente, ex: `doce-sensacoes-api-2`

---

## 🎯 **Próximo Passo:**

Após criar a Service Account:
1. **Clique em "Gerenciar"** na sua Service Account
2. **Vá para aba "Chaves"**
3. **Clique em "Adicionar chave"** → "Criar nova chave"
4. **Tipo:** JSON
5. **Clique em "Criar"** (arquivo será baixado)

---

## 📞 **Precisa de ajuda?**

Se não conseguir encontrar alguma opção ou tiver algum erro, me avise! Vou te ajudar a resolver! 🍰 