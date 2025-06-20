
import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Product } from '../types/Product';
interface ProductContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'productId'>) => Promise<Product | undefined>;
  updateProduct: (id: string, productData: Product) => Promise<Product | undefined>;
  deleteProduct: (id: string) => Promise<boolean>;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | undefined>;
  loading: boolean;
  error: string | null;
}

export const ProductContext = createContext<ProductContextType>({} as ProductContextType);

const API_BASE_URL = 'http://localhost:8080/api/products';

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
            throw new Error(`Product with ID ${id} not found.`);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Product = await response.json();
      setProducts(prev => {
        const existingIndex = prev.findIndex(p => p.productId === data.productId);
        if (existingIndex > -1) {
          const newProducts = [...prev];
          newProducts[existingIndex] = data;
          return newProducts;
        }
        return [...prev, data];
      });
      return data;
    } catch (err: any) {
      console.error(`Failed to fetch product ${id}:`, err);
      setError(err.message || `Failed to load product ${id}.`);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData: Omit<Product, 'productId'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      const createdProduct: Product = await response.json();
      setProducts(prevProducts => [...prevProducts, createdProduct]);
      return createdProduct;
    } catch (err: any) {
      console.error("Error adding product:", err);
      setError(err.message || "Failed to add product.");
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Product) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      const updatedProduct: Product = await response.json();
      setProducts(prevProducts =>
        prevProducts.map(p => (p.productId === id ? updatedProduct : p))
      );
      return updatedProduct;
    } catch (err: any) {
      console.error("Error updating product:", err);
      setError(err.message || "Failed to update product.");
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }
      setProducts(prevProducts => prevProducts.filter(p => p.productId !== id));
      return true;
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setError(err.message || "Failed to delete product.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      fetchProducts,
      fetchProductById,
      loading,
      error
    }}>
      {children}
    </ProductContext.Provider>
  );
};