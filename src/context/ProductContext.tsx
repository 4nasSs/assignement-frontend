import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import axios from 'axios';
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
      const response = await axios.get<Product[]>(API_BASE_URL);
      setProducts(response.data);
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
      const response = await axios.get<Product>(`${API_BASE_URL}/${id}`);
      const data = response.data;
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
      if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
        setError(`Product with ID ${id} not found.`);
      } else {
        setError(err.message || `Failed to load product ${id}.`);
      }
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData: Omit<Product, 'productId'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<Product>(API_BASE_URL, productData);
      const createdProduct = response.data;
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
      const response = await axios.put<Product>(`${API_BASE_URL}/${id}`, productData);
      const updatedProduct = response.data;
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
      await axios.delete<void>(`${API_BASE_URL}/${id}`);
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