# 🍰 Doce Sensações - Frontend

Esta pasta contém todos os arquivos necessários para o deploy do site estático.

## 📁 Estrutura

```
public/
├── index.html          # Página principal
├── login.html          # Página de login
├── cadastro.html       # Página de cadastro
├── perfil.html         # Página de perfil
├── styles/             # Arquivos CSS
├── javascript/         # Arquivos JavaScript
├── images/             # Imagens do site
└── components/         # Componentes reutilizáveis
```

## 🚀 Deploy

### Netlify
1. Conecte o repositório GitHub
2. Configure:
   - Build command: (deixe vazio)
   - Publish directory: `public`
3. Deploy!

### Render
1. Conecte o repositório GitHub
2. Escolha "Static Site"
3. Configure:
   - Build Command: (deixe vazio)
   - Publish Directory: `public`
4. Deploy!

## ✅ Caminhos Corrigidos

Todos os caminhos foram corrigidos para funcionar em produção:
- `src/images/` → `images/`
- `src/styles/` → `styles/`
- `src/javascript/` → `javascript/`
- `src/login.html` → `login.html` 