#!/bin/bash

echo "🛤️ Agregando rutas y navegación para Revisar Cotizaciones..."

# 1. Agregar import en App.jsx
echo "📝 Agregando import en App.jsx..."
if ! grep -q "QuoteReviewPage" src/App.jsx; then
    sed -i '/import ClientesPage/a import QuoteReviewPage from '\''./components/pages/QuoteReviewPage'\'';' src/App.jsx
    echo "✓ Import agregado"
else
    echo "✓ Import ya existe"
fi

# 2. Agregar ruta en App.jsx
echo "📝 Agregando ruta en App.jsx..."
if ! grep -q "revisar-cotizaciones" src/App.jsx; then
    sed -i '/path="clientes"/a \              <Route path="revisar-cotizaciones" element={<QuoteReviewPage />} />' src/App.jsx
    echo "✓ Ruta agregada"
else
    echo "✓ Ruta ya existe"
fi

# 3. Agregar item al sidebar
echo "📝 Agregando item al Sidebar..."
if ! grep -q "revisar-cotizaciones" src/components/molecules/Sidebar/Sidebar.jsx; then
    # Buscar la línea del historial y agregar después
    sed -i "/{ id: 'historial'/a \    { id: 'revisar', path: '/revisar-cotizaciones', icon: FileText, label: 'Revisar Cotizaciones' }," src/components/molecules/Sidebar/Sidebar.jsx
    echo "✓ Item de menú agregado"
else
    echo "✓ Item de menú ya existe"
fi

# 4. Verificar que FileText esté importado en Sidebar
echo "📝 Verificando iconos en Sidebar..."
if ! grep -q "FileText" src/components/molecules/Sidebar/Sidebar.jsx; then
    sed -i 's/{ Home, User, FileText, History, ShoppingCart, LogOut, Menu }/{ Home, User, FileText, History, ShoppingCart, LogOut, Menu }/' src/components/molecules/Sidebar/Sidebar.jsx
    echo "✓ Icono FileText ya está importado"
fi

echo ""
echo "✅ ¡Rutas y navegación agregadas exitosamente!"
echo ""
echo "🎯 Ahora puedes acceder desde:"
echo "   📱 Sidebar → 'Revisar Cotizaciones'"
echo "   🌐 URL directa → http://localhost:5173/revisar-cotizaciones"
echo ""
echo "🚀 Ejecuta: npm run dev"
echo "🎉 ¡Ya puedes probar el módulo completo!"
