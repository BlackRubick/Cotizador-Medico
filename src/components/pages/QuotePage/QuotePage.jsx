import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CatalogPage from '../CatalogPage';
import QuoteConfigPage from '../QuoteConfigPage';
import CartPage from '../CartPage';
import QuoteGeneratorPage from '../QuoteGeneratorPage';

const QuotePage = () => {
  return (
    <Routes>
      <Route index element={<CatalogPage />} />
      <Route path="categoria/:categoryId" element={<QuoteConfigPage />} />
      <Route path="carrito" element={<CartPage />} />
      <Route path="generar" element={<QuoteGeneratorPage />} />
      <Route path="*" element={<Navigate to="/cotizar" replace />} />
    </Routes>
  );
};

export default QuotePage;
