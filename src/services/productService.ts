import type { Product } from '../types/Product';

const API_BASE = 'http://localhost:8080/api/products';

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Fetch error');
  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error('Fetch error');
  return res.json();
}

export async function createProduct(p: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch(API_BASE, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p)
  });
  if (!res.ok) throw new Error('Create error');
  return res.json();
}

export async function updateProductById(id: number, p: Product): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(p)
  });
  if (!res.ok) throw new Error('Update error');
}

export async function deleteProductById(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete error');
}
