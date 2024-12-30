import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditStock = ({ onEdit }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { stock } = location.state;

  const [updatedStock, setUpdatedStock] = useState(stock);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedStock((prev) => ({
      ...prev,
      [name]: name === 'quantity' || name === 'buyPrice' ? parseFloat(value) : value,
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`http://localhost:5000/stocks/${updatedStock.ticker}`, updatedStock);
      onEdit(updatedStock);  // Call the onEdit callback
      navigate('/');  // Navigate back after successful update
    } catch (err) {
      console.error('Error updating stock:', err);
      setErrors({ submit: 'Error updating stock. Please try again.' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!updatedStock.name) newErrors.name = 'Stock name is required';
    if (updatedStock.quantity <= 0) newErrors.quantity = 'Quantity must be a positive number';
    if (updatedStock.buyPrice <= 0) newErrors.buyPrice = 'Buy price must be a positive number';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6 text-indigo-300">Edit Stock</h1>

        {errors.submit && <p className="text-red-500 mb-4">{errors.submit}</p>}

        <div className="space-y-4">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Stock Name</label>
            <input
              type="text"
              name="name"
              value={updatedStock.name}
              onChange={handleChange}
              className={`input input-bordered w-full bg-gray-800 text-white ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={updatedStock.quantity}
              onChange={handleChange}
              className={`input input-bordered w-full bg-gray-800 text-white ${errors.quantity ? 'border-red-500' : ''}`}
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Buy Price</label>
            <input
              type="number"
              name="buyPrice"
              value={updatedStock.buyPrice}
              onChange={handleChange}
              className={`input input-bordered w-full bg-gray-800 text-white ${errors.buyPrice ? 'border-red-500' : ''}`}
            />
            {errors.buyPrice && <p className="text-red-500 text-sm">{errors.buyPrice}</p>}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1">Current Price (Non-Editable)</label>
            <input
              type="number"
              name="currentPrice"
              value={updatedStock.currentPrice}
              readOnly
              disabled
              className="input input-bordered w-full bg-gray-800 text-gray-400 cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSave}
            className="btn btn-primary mt-4 w-full"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStock;
