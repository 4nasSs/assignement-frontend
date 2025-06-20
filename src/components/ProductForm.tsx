import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ProductContext } from '../context/ProductContext';
import type { Product } from '../types/Product';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, fetchProductById, loading, error } = useContext(ProductContext);

  const [formData, setFormData] = useState<Product>({
    productId: '',
    productName: '',
    productDescription: '',
    productPrice: 0,
  });

  useEffect(() => {
    let mounted = true;

    const loadProductData = async () => {
      if (isEdit && id) {
        const existing = products.find(p => p.productId === id);

        if (existing) {
          if (mounted) setFormData(existing);
        } else {
          const fetchedProduct = await fetchProductById(id);
          if (mounted && fetchedProduct) {
            setFormData(fetchedProduct);
          } else if (mounted && !fetchedProduct) {
            navigate('/');
            alert("Product not found!");
          }
        }
      } else {
        if (mounted) {
          setFormData({ productId: '', productName: '', productDescription: '', productPrice: 0 });
        }
      }
    };

    loadProductData();

    return () => { mounted = false; };
  }, [id, isEdit, products, fetchProductById, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'productPrice' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    try {
      if (isEdit) {
        const updated = await updateProduct(formData.productId, formData);
        success = !!updated;
      } else {
        const productDataForAdd = {
          productName: formData.productName,
          productDescription: formData.productDescription,
          productPrice: formData.productPrice,
        };
        const added = await addProduct(productDataForAdd);
        success = !!added;
      }

      if (success) {
        navigate('/');
      } else {
        alert("Operation failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      alert(`Error submitting product: ${err.message || "Something went wrong."}`);
    }
  };

  if (loading && isEdit && !formData.productId) {
    return <div className="p-6 text-center text-gray-600">Loading product details...</div>;
  }
  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="productDescription"
            name="productDescription"
            onChange={handleChange}
            placeholder="Product Description"
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input
            type="number"
            id="productPrice"
            name="productPrice" // Use productPrice
            value={formData.productPrice}
            onChange={handleChange}
            placeholder="Price"
            step="0.01"
            className="w-full border border-gray-300 p-3 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-md transition duration-200 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition duration-200 shadow-sm"
          >
            {isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;