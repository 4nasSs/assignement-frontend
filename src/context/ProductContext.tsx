import React, { createContext, useState, type ReactNode } from 'react';
import type { Product } from '../types/Product';

interface ProductContextType {
  products: Product[];
  fetchProducts: () => void;
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (id: number, product: Product) => Promise<boolean>;
  deleteProduct: (id: number) => Promise<boolean>;
}

export const ProductContext = createContext<ProductContextType>({} as ProductContextType);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (product: Product) => {
    try {
      const response = await fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) return false;
      fetchProducts();
      return true;
    } catch (error) {
      return false;
    }
  };

  const updateProduct = async (id: number, product: Product) => {
    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (!response.ok) return false;
      fetchProducts();
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) return false;
      fetchProducts();
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <ProductContext.Provider value={{ products, fetchProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};