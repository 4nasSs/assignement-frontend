import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ProductContext } from '../context/ProductContext';
import type { Product } from '../types/Product';

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, fetchProducts } = useContext(ProductContext);

  const [formData, setFormData] = useState<Product>({ id: '', name: '', description: '', price: 0 });

  useEffect(() => {
    if (isEdit && id) {
      const existing = products.find(p => p.id === id);
      if (existing) setFormData(existing);
      else fetchProducts();
    }
  }, [id, products]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = isEdit
      ? await updateProduct(formData.id, formData)
      : await addProduct(formData);

    if (success) navigate('/');
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name"
               className="w-full border p-2 rounded" required />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"
                  className="w-full border p-2 rounded" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price"
               className="w-full border p-2 rounded" required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">{isEdit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default ProductForm;