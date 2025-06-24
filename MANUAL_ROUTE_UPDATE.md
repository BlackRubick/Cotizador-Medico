# ACTUALIZACIÓN MANUAL REQUERIDA

Para completar la integración, agrega esta ruta en src/App.jsx:

```jsx
// En la sección de rutas protegidas, agregar:
<Route path="revisar-cotizaciones" element={<QuoteReviewPage />} />
```

Y actualizar el Sidebar para incluir el nuevo item:

```jsx
// En src/components/molecules/Sidebar/Sidebar.jsx, agregar al array menuItems:
{ id: 'revisar', path: '/revisar-cotizaciones', icon: FileText, label: 'Revisar Cotizaciones' },
```
