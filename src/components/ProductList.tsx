import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ProductContext } from '../context/ProductContext';
import ProductCard from './ProductCard';

const ProductList: React.FC = () => {
  const { products, deleteProduct, loading, error, fetchProducts } = useContext(ProductContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(id);
      if (success) {
        console.log(`Product ${id} deleted.`);
      } else {
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  if (loading && products.length === 0) {
    return <div className="p-6 text-center text-gray-600">Loading products...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Product Catalog</h2>
      <button
        onClick={() => navigate('/add')}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg mb-6 shadow-md transition duration-200"
      >
        Add New Product
      </button>

      {products.length === 0 ? (
        <p className="text-gray-700 text-lg">No products found. Start by adding one!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard
              key={product.productId}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;