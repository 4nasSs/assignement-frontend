import axios from 'axios';
import type { Product } from '../types/Product';

const API_BASE = 'http://localhost:8080/api/products';

export async function fetchAllProducts(): Promise<Product[]> {
  try {
    const res = await axios.get<Product[]>(API_BASE);
    return res.data;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw new Error('Failed to fetch all products');
  }
}

export async function fetchProductById(id: string): Promise<Product> {
  try {
    const res = await axios.get<Product>(`${API_BASE}/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw new Error(`Failed to fetch product with ID ${id}`);
  }
}

export async function createProduct(p: Omit<Product, 'productId'>): Promise<Product> {
  try {
    const res = await axios.post<Product>(API_BASE, p, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

export async function updateProductById(id: string, p: Product): Promise<void> {
  try {
    await axios.put<void>(`${API_BASE}/${id}`, p, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw new Error(`Failed to update product with ID ${id}`);
  }
}

export async function deleteProductById(id: string): Promise<void> {
  try {
    await axios.delete<void>(`${API_BASE}/${id}`);
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw new Error(`Failed to delete product with ID ${id}`);
  }
}