import React from 'react';
import { useNavigate } from 'react-router';
import type { Product } from '../types/Product';

interface Props {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<Props> = ({ product, onDelete }) => {
  const navigate = useNavigate();

  if (!product || typeof product.productPrice !== 'number') {
    console.warn("ProductCard received invalid product or price:", product);
    return null;
  }

  const handleEditClick = () => {
    navigate(`/edit/${product.productId}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex-grow mb-2 sm:mb-0">
        <h3 className="text-xl font-semibold text-gray-800">{product.productName}</h3>
        <p className="text-gray-600 text-sm">{product.productDescription}</p>
        <p className="text-lg font-bold text-blue-600 mt-1">${product.productPrice.toFixed(2)}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleEditClick}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(product.productId)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;