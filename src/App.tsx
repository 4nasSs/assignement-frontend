import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router';
import ProductListPage from './pages/ProductListPage';
import ProductFormPage from './pages/ProductFormPage';
import { ProductProvider } from './context/ProductContext';

const App: React.FC = () => {
  return (
    <ProductProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/add" element={<ProductFormPage />} />
          <Route path="/edit/:id" element={<ProductFormPage />} />
        </Routes>
      </Router>
    </ProductProvider>
  );
};

export default App;