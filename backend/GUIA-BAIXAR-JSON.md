# 📥 Como Baixar Arquivo JSON de Credenciais

## 📍 **Passo 1: Acessar Service Account**

Após criar a Service Account, você verá:

```
┌─────────────────────────────────────┐
│ Contas de serviço                   │
├─────────────────────────────────────┤
│                                     │
│ doce-sensacoes-api@projeto.iam...   │
│                                     │
│ [Gerenciar] [Editar] [Excluir]      │ ← CLIQUE EM "GERENCIAR"
└─────────────────────────────────────┘
```

## 🔑 **Passo 2: Aba "Chaves"**

Na página da Service Account:

```
┌─────────────────────────────────────┐
│ doce-sensacoes-api@projeto.iam...   │
├─────────────────────────────────────┤
│                                     │
│ [Detalhes] [Permissões] [Chaves]    │ ← CLIQUE EM "CHAVES"
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Chaves                          │ │
│ │                                 │ │
│ │ Nenhuma chave configurada       │ │
│ │                                 │ │
│ │ [Adicionar chave]               │ │ ← CLIQUE AQUI
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## 🔧 **Passo 3: Criar Nova Chave**

```
┌─────────────────────────────────────┐
│ Adicionar chave                     │
├─────────────────────────────────────┤
│                                     │
│ [Criar nova chave]                  │ ← CLIQUE AQUI
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Tipo de chave:                  │ │
│ │                                 │ │
│ │ ○ JSON                          │ │ ← SELECIONE ESTA
│ │ ○ P12                           │ │
│ │                                 │ │
│ │ [Criar]                         │ │ ← CLIQUE AQUI
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## ✅ **Passo 4: Download Automático**

Após clicar em "Criar":

```
┌─────────────────────────────────────┐
│ ✅ Chave criada com sucesso         │
│                                     │
│ O arquivo foi baixado:              │
│ doce-sensacoes-backend-123456.json  │
│                                     │
│ 📁 Local: Downloads                 │
└─────────────────────────────────────┘
```

---

## 📁 **O que fazer com o arquivo baixado:**

### **Passo 5: Mover para o projeto**

1. **Vá para sua pasta de Downloads**
2. **Encontre o arquivo:** `doce-sensacoes-backend-123456.json`
3. **Mova para:** `backend/google-credentials.json`
4. **Renomeie para:** `google-credentials.json`

### **Comando no terminal:**

```bash
# Navegar para o projeto
cd /Users/pedropauloreis/Desktop/DOCE\ SENSACOES/backend

# Mover arquivo (substitua pelo nome real do arquivo)
mv ~/Downloads/doce-sensacoes-backend-123456.json google-credentials.json
```

---

## 🚨 **Importante sobre Segurança:**

### **⚠️ NUNCA compartilhe este arquivo:**
- ❌ Não envie por email
- ❌ Não poste em redes sociais
- ❌ Não commite no Git
- ❌ Não compartilhe com ninguém

### **✅ Mantenha seguro:**
- ✅ Guarde em local seguro
- ✅ Faça backup
- ✅ Use apenas no seu projeto

---

## 🎯 **Próximo Passo:**

Após baixar e mover o arquivo:
1. **Criar planilha Google Sheets**
2. **Compartilhar com email da Service Account**
3. **Configurar variáveis de ambiente**
4. **Testar conexão**

---

## 📞 **Precisa de ajuda?**

Se não conseguir encontrar alguma opção ou tiver algum erro, me avise! Vou te ajudar a resolver! 🍰 