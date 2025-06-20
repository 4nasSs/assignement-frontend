import React, { useContext, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router';

const ProductList: React.FC = () => {
  const { products, fetchProducts, deleteProduct } = useContext(ProductContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Products</h2>
        <button onClick={() => navigate('/add')} className="bg-blue-600 text-white px-4 py-2 rounded">Add Product</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onDelete={(id: string) => deleteProduct(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;