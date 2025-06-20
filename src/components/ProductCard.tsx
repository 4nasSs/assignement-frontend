import React from 'react';
import { useNavigate } from 'react-router';
import type { Product } from '../types/Product';

interface Props {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<Props> = ({ product, onDelete }) => {
  const navigate = useNavigate();
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold">{product.name}</h3>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-green-600 font-semibold">${product.price.toFixed(2)}</p>
      <div className="flex gap-2 mt-3">
        <button onClick={() => navigate(`/edit/${product.id}`)} className="bg-yellow-500 text-white px-4 py-1 rounded">Edit</button>
        <button onClick={() => onDelete(String(product.id))} className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
      </div>
    </div>
  );
};

export default ProductCard;