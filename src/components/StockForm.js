import React, { useState } from 'react';
import axios from 'axios';

const StockForm = ({ stock, onSave }) => {
  const [name, setName] = useState(stock ? stock.name : '');
  const [ticker, setTicker] = useState(stock ? stock.ticker : '');
  const [quantity, setQuantity] = useState(stock ? stock.quantity : 0);
  const [buyPrice, setBuyPrice] = useState(stock ? stock.buyPrice : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !ticker || quantity <= 0 || buyPrice <= 0) {
      setError('All fields are required, and numeric values must be positive.');
      setLoading(false);
      return;
    }

    const stockData = { name, ticker, quantity, buyPrice };
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    try {
      const response = stock
        ? await axios.put(`${apiUrl}/stocks/${stock.id}`, stockData)
        : await axios.post(`${apiUrl}/stocks`, stockData);

      onSave(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to save stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-lg font-bold mb-4">{stock ? 'Edit Stock' : 'Add New Stock'}</h2>
      
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <div className="mb-4">
        <label className="block text-sm mb-1" htmlFor="name">Stock Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Stock Name"
          className="input input-bordered w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1" htmlFor="ticker">Ticker</label>
        <input
          id="ticker"
          type="text"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Ticker"
          className="input input-bordered w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1" htmlFor="quantity">Quantity</label>
        <input
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
          placeholder="Quantity"
          className="input input-bordered w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm mb-1" htmlFor="buyPrice">Buy Price</label>
        <input
          id="buyPrice"
          type="number"
          value={buyPrice}
          onChange={(e) => setBuyPrice(parseFloat(e.target.value) || 0)}
          placeholder="Buy Price"
          className="input input-bordered w-full"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Stock'}
      </button>
    </form>
  );
};

export default StockForm;
