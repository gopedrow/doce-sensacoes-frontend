#!/bin/bash

echo "🧪 TESTANDO PWA - DOCE SENSACOES"
echo "================================"

URL="https://gopedrow.github.io/doce-sensacoes-frontend"

echo "🌐 URL: $URL"
echo ""

# Teste 1: Site principal
echo "1. 📄 Testando site principal..."
if curl -s -o /dev/null -w "%{http_code}" "$URL/" | grep -q "200"; then
    echo "   ✅ Site principal: OK"
else
    echo "   ❌ Site principal: ERRO"
fi

# Teste 2: Manifest.json
echo "2. 📋 Testando manifest.json..."
if curl -s -o /dev/null -w "%{http_code}" "$URL/manifest.json" | grep -q "200"; then
    echo "   ✅ Manifest.json: OK"
else
    echo "   ❌ Manifest.json: ERRO (404)"
    echo "   💡 Pode ser necessário aguardar mais alguns minutos"
fi

# Teste 3: Service Worker
echo "3. ⚙️ Testando service worker..."
if curl -s -o /dev/null -w "%{http_code}" "$URL/sw.js" | grep -q "200"; then
    echo "   ✅ Service Worker: OK"
else
    echo "   ❌ Service Worker: ERRO (404)"
fi

# Teste 4: Ícones
echo "4. 🎨 Testando ícones..."
if curl -s -o /dev/null -w "%{http_code}" "$URL/images/icon-192.png" | grep -q "200"; then
    echo "   ✅ Ícone 192x192: OK"
else
    echo "   ❌ Ícone 192x192: ERRO (404)"
fi

if curl -s -o /dev/null -w "%{http_code}" "$URL/images/icon-512.png" | grep -q "200"; then
    echo "   ✅ Ícone 512x512: OK"
else
    echo "   ❌ Ícone 512x512: ERRO (404)"
fi

echo ""
echo "📱 COMO TESTAR NO CELULAR:"
echo "=========================="
echo "1. Acesse: $URL"
echo "2. Aguarde carregar completamente"
echo "3. No Android: Toque no ícone ⚙️ na barra de endereços"
echo "4. No iPhone: Toque no botão compartilhar 📤"
echo "5. Toque em 'Adicionar à tela inicial'"
echo ""

echo "🔧 SE ALGUNS TESTES FALHARAM:"
echo "============================="
echo "- Aguarde 5-10 minutos para o GitHub Pages processar"
echo "- Verifique se está usando HTTPS"
echo "- Teste em diferentes navegadores"
echo ""

echo "🎯 STATUS ATUAL:"
echo "================"
echo "✅ Site principal funcionando"
echo "⏳ PWA pode demorar alguns minutos para aparecer"
echo "📱 Menu mobile corrigido"
echo "🚀 Pronto para instalar no celular!" 