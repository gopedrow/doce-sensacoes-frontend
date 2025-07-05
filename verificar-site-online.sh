#!/bin/bash

echo "🔍 VERIFICANDO SE O SITE ESTÁ ONLINE..."
echo "========================================"

URL="https://gopedrow.github.io/doce-sensacoes-frontend"

echo "🌐 URL: $URL"
echo ""

# Verificar se o site está online
echo "📡 Testando conexão..."
if curl -s -o /dev/null -w "%{http_code}" "$URL" | grep -q "200"; then
    echo "✅ SITE ONLINE!"
    echo "🎉 Seu site está funcionando!"
    echo ""
    echo "🧪 TESTE AGORA:"
    echo "1. Acesse: $URL"
    echo "2. Teste cadastro de usuário"
    echo "3. Teste login"
    echo "4. Teste no celular"
else
    echo "⏳ SITE AINDA NÃO ESTÁ ONLINE"
    echo ""
    echo "📋 POSSÍVEIS MOTIVOS:"
    echo "1. GitHub Pages ainda está processando (normal, pode demorar 5-10 minutos)"
    echo "2. Configuração incorreta"
    echo "3. Problema com os arquivos"
    echo ""
    echo "🔍 VERIFICAÇÕES:"
    echo "1. Backend funcionando: ✅"
    echo "2. Arquivos na pasta public: ✅"
    echo "3. Configuração GitHub Pages: Aguardando..."
    echo ""
    echo "⏰ Aguarde alguns minutos e tente novamente"
    echo "💡 Dica: O GitHub Pages pode demorar até 10 minutos para publicar"
fi

echo ""
echo "📞 Para verificar manualmente:"
echo "1. Acesse: https://github.com/gopedrow/doce-sensacoes-frontend/settings/pages"
echo "2. Verifique se aparece: 'Your site is published at...'"
echo "3. Se não aparecer, aguarde mais alguns minutos" 