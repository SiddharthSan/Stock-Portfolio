import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditStock = ({ onEdit }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stock } = location.state;

  const [updatedStock, setUpdatedStock] = useState(stock);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStock((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'buyPrice' ? parseFloat(value) : value,
    }));
  };

  const handleSave = () => {
    // Trigger the onEdit function and navigate back
    onEdit(updatedStock);
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Stock</h1>
      <div className="space-y-4">
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Stock Name</label>
          <input
            type="text"
            name="name"
            value={updatedStock.name}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={updatedStock.quantity}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Buy Price</label>
          <input
            type="number"
            name="buyPrice"
            value={updatedStock.buyPrice}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Current Price (Non-Editable)</label>
          <input
            type="number"
            name="currentPrice"
            value={updatedStock.currentPrice}
            readOnly
            disabled
            className="input input-bordered w-full bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>
        <button 
          onClick={handleSave} 
          className="btn btn-primary mt-4"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditStock;