import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePrices } from '../context/priceContext';
import Navbar from './Navbar'; // Adjust the import path based on your file structure
import axios from 'axios';

const Dashboard = ({ onDelete }) => {
  const { prices, isFetching, errors } = usePrices();
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('/stocks');
        setStocks(response.data);
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
      }
    };

    fetchStocks();
  }, []);

  const handleDelete = async (ticker) => {
    try {
      await onDelete(ticker);
      setStocks(stocks.filter(stock => stock.ticker !== ticker));
    } catch (error) {
      console.error('Failed to delete stock:', error);
    }
  };

  const calculateTotalValue = (quantity, price) => {
    return quantity * price;
  };

  const calculateProfitLoss = (quantity, buyPrice, currentPrice) => {
    const invested = quantity * buyPrice;
    const current = quantity * currentPrice;
    return current - invested;
  };

  const calculateTotalPortfolioValue = () => {
    return stocks.reduce((total, stock) => {
      const currentPrice = prices[stock.ticker]?.price || stock.currentPrice;
      return total + calculateTotalValue(stock.quantity, currentPrice);
    }, 0);
  };

  const calculateTotalProfitLoss = () => {
    return stocks.reduce((total, stock) => {
      const currentPrice = prices[stock.ticker]?.price || stock.currentPrice;
      return total + calculateProfitLoss(stock.quantity, stock.buyPrice, currentPrice);
    }, 0);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Stock Portfolio</h1>
          <Link
            to="/add-stock"
            className="mt-4 md:mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Stock
          </Link>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">Total Portfolio Value</h2>
            <p className="text-2xl font-bold">{formatCurrency(calculateTotalPortfolioValue())}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">Total Profit/Loss</h2>
            <p
              className={`text-2xl font-bold ${
                calculateTotalProfitLoss() >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {formatCurrency(calculateTotalProfitLoss())}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">Number of Stocks</h2>
            <p className="text-2xl font-bold">{stocks.length}</p>
          </div>
        </div>

        {/* Stocks Table */}
        <div className="bg-gray-800 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Ticker
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Buy Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Profit/Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {stocks.map((stock) => {
                const priceData = prices[stock.ticker];
                const currentPrice = priceData?.price || stock.currentPrice;
                const totalValue = calculateTotalValue(stock.quantity, currentPrice);
                const profitLoss = calculateProfitLoss(stock.quantity, stock.buyPrice, currentPrice);
                const profitLossPercentage = (profitLoss / (stock.quantity * stock.buyPrice)) * 100;

                return (
                  <tr key={stock.ticker}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-100">{stock.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{stock.ticker}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{stock.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatCurrency(stock.buyPrice)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {errors[stock.ticker] ? (
                        <span className="text-red-500">Error fetching price</span>
                      ) : (
                        <div>
                          {formatCurrency(currentPrice)}
                          {priceData && (
                            <span
                              className={`ml-2 text-sm ${
                                priceData.change >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              ({priceData.change >= 0 ? '+' : ''}{formatPercentage(priceData.changePercent)})
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{formatCurrency(totalValue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {formatCurrency(profitLoss)}
                        <span className="text-sm ml-1">
                          ({profitLoss >= 0 ? '+' : ''}{formatPercentage(profitLossPercentage)}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Link
                          to={`/edit-stock/${stock.ticker}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(stock.ticker)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Loading Indicator */}
        {isFetching && (
          <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow">
            Updating prices...
          </div>
        )}

        {/* Empty State */}
        {stocks.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-100 mb-2">No stocks in your portfolio</h3>
            <p className="text-gray-400">Add your first stock to start tracking your investments.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;