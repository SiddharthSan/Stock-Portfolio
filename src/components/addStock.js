import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddStock = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState(1); // Default to 1
  const [buyPrice, setBuyPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Stock name is required';
    if (!ticker) newErrors.ticker = 'Ticker is required';
    if (!quantity || quantity <= 0) newErrors.quantity = 'Quantity must be a positive number';
    if (!buyPrice || buyPrice <= 0) newErrors.buyPrice = 'Buy price must be a positive number';
    if (!currentPrice || currentPrice <= 0) newErrors.currentPrice = 'Current price must be a positive number';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newStock = {
      name,
      ticker,
      quantity: parseInt(quantity),
      buyPrice: parseFloat(buyPrice),
      currentPrice: parseFloat(currentPrice),
    };

    try {
      await axios.post('http://localhost:5000/stocks', newStock);
      navigate('/');
    } catch (err) {
      console.error('Error adding stock:', err);
      setErrors({ submit: 'Error adding stock. Please try again.' });
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white">
      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-indigo-300">Add New Stock</h2>
        {errors.submit && <p className="text-red-500 mb-4">{errors.submit}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-medium" htmlFor="name">Stock Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input input-bordered w-full ${errors.name ? 'border-red-500' : ''}`}
              required
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <label className="block font-medium" htmlFor="ticker">Ticker</label>
            <input
              type="text"
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className={`input input-bordered w-full ${errors.ticker ? 'border-red-500' : ''}`}
              required
            />
            {errors.ticker && <p className="text-red-500 text-sm">{errors.ticker}</p>}
          </div>
          <div>
            <label className="block font-medium" htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={`input input-bordered w-full ${errors.quantity ? 'border-red-500' : ''}`}
              required
            />
            {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
          </div>
          <div>
            <label className="block font-medium" htmlFor="buyPrice">Buy Price</label>
            <input
              type="number"
              id="buyPrice"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className={`input input-bordered w-full ${errors.buyPrice ? 'border-red-500' : ''}`}
              required
            />
            {errors.buyPrice && <p className="text-red-500 text-sm">{errors.buyPrice}</p>}
          </div>
          <div>
            <label className="block font-medium" htmlFor="currentPrice">Current Price</label>
            <input
              type="number"
              id="currentPrice"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              className={`input input-bordered w-full ${errors.currentPrice ? 'border-red-500' : ''}`}
              required
            />
            {errors.currentPrice && <p className="text-red-500 text-sm">{errors.currentPrice}</p>}
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">Add Stock</button>
        </form>
      </div>
    </div>
  );
};

export default AddStock;
