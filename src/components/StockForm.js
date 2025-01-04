// components/StockForm.js
import React, { useState } from 'react';
import axios from 'axios';

const StockForm = ({ stock, onSave }) => {
  const [name, setName] = useState(stock ? stock.name : '');
  const [ticker, setTicker] = useState(stock ? stock.ticker : '');
  const [quantity, setQuantity] = useState(stock ? stock.quantity : 0);
  const [buyPrice, setBuyPrice] = useState(stock ? stock.buyPrice : 0);
  const [currentPrice, setCurrentPrice] = useState(stock ? stock.currentPrice : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCurrentPrice = async (tickerSymbol) => {
    try {
      const response = await axios.get(`/live-price/${tickerSymbol}`);
      setCurrentPrice(response.data.livePrice);
    } catch (err) {
      console.error('Error fetching current price:', err);
      setError('Failed to fetch current price. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!name || !ticker || quantity <= 0 || buyPrice <= 0) {
      setError('All fields are required, and numeric values must be positive.');
      setLoading(false);
      return;
    }

    try {
      // Fetch current price before saving
      const response = await axios.get(`/live-price/${ticker}`);
      const currentPrice = response.data.livePrice;

      const stockData = { name, ticker, quantity, buyPrice, currentPrice };
      
      const saveResponse = stock
        ? await axios.put(`/stocks/${stock.id}`, stockData)
        : await axios.post(`/stocks`, stockData);

      onSave(saveResponse.data);
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
          onBlur={() => fetchCurrentPrice(ticker)}
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

      <div className="mb-4">
        <label className="block text-sm mb-1" htmlFor="currentPrice">Current Price</label>
        <input
          id="currentPrice"
          type="text"
          value={currentPrice || ''}
          readOnly
          className="input input-bordered w-full bg-gray-700 text-gray-400 cursor-not-allowed"
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