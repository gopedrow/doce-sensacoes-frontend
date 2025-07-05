#!/bin/bash

echo "🚀 PUBLICANDO SITE DOCE SENSACOES"
echo "=================================="

# Verificar se o backend está funcionando
echo "🔍 Verificando backend..."
cd backend
if node testar-api.js; then
    echo "✅ Backend funcionando!"
else
    echo "❌ Backend com problemas!"
    exit 1
fi

cd ..

# Verificar arquivos do frontend
echo "📁 Verificando arquivos do frontend..."
if [ -d "public" ]; then
    echo "✅ Pasta public encontrada"
    echo "📄 Arquivos disponíveis:"
    ls -la public/
else
    echo "❌ Pasta public não encontrada!"
    exit 1
fi

echo ""
echo "🎯 PRÓXIMOS PASSOS:"
echo "=================="
echo "1. 🌐 Acesse: https://netlify.com"
echo "2. 📁 Clique em 'New site from Git'"
echo "3. 🔗 Conecte com GitHub"
echo "4. 📂 Selecione o repositório: DOCE SENSACOES"
echo "5. ⚙️ Configure:"
echo "   - Base directory: public"
echo "   - Build command: (deixe vazio)"
echo "   - Publish directory: ."
echo "6. 🚀 Clique em 'Deploy site'"
echo ""
echo "🔗 URL final será: https://doce-sensacoes.netlify.app"
echo ""
echo "🎉 Boa sorte! Seu site ficará incrível!" 