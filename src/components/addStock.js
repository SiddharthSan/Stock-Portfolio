import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePrices } from '../context/priceContext';
import axios from 'axios';
import Navbar from './Navbar';


const AddStockPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onStockAdded = location.state?.onStockAdded;

  const [formData, setFormData] = useState({
    name: '',
    ticker: '',
    quantity: '',
    buyPrice: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getCurrentPrice } = usePrices();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'quantity') {
      processedValue = value ? parseInt(value) : '';
    } else if (name === 'buyPrice') {
      processedValue = value ? parseFloat(value) : '';
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.ticker || !formData.quantity || !formData.buyPrice) {
      setError('All fields are required');
      return false;
    }
    if (formData.quantity <= 0) {
      setError('Quantity must be greater than 0');
      return false;
    }
    if (formData.buyPrice <= 0) {
      setError('Buy price must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // First get the current price
      const currentPrice = await getCurrentPrice(formData.ticker);
      
      if (!currentPrice) {
        throw new Error('Failed to fetch current price');
      }

      // Prepare the stock data
      const stockData = {
        name: formData.name,
        ticker: formData.ticker.toUpperCase(),
        quantity: parseInt(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice),
        currentPrice: currentPrice
      };

      // Make the API call directly
      await axios.post('/stocks', stockData);

      // Call the onStockAdded callback if provided
      if (onStockAdded) {
        onStockAdded(stockData);
      }
      
      // If successful, navigate back to the dashboard
      navigate('/');
      
    } catch (error) {
      console.error('Error adding stock:', error);
      setError(error.response?.data?.error || 'Failed to add stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="bg-gray-900 min-h-screen flex items-center justify-center py-12">
      <div className="max-w-4xl w-full mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Add New Stock</h1>
        
        {error && (
          <div className="bg-red-600 text-white px-4 py-3 rounded mb-6" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Company Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="e.g., Apple Inc"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Ticker Symbol</label>
            <input
              type="text"
              name="ticker"
              value={formData.ticker}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="e.g., AAPL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Number of shares"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Buy Price</label>
            <input
              type="number"
              name="buyPrice"
              value={formData.buyPrice}
              onChange={handleChange}
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-700 text-white"
              placeholder="Price per share"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddStockPage;