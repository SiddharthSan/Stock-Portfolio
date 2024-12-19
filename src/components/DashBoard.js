// Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StockTable from './StockTable';
import Navbar from './Navbar';
import axios from 'axios';

const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const navigate = useNavigate();

  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/stocks');
      setStocks(response.data);
    } catch (err) {
      console.error('Error fetching stock data:', err);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []); 

  useEffect(() => {
    calculateTotalValue(stocks);
  }, [stocks]);

  const calculateTotalValue = (stocks) => {
    const total = stocks.reduce((sum, stock) => {
      return sum + (stock.quantity * stock.currentPrice);
    }, 0);
    setTotalValue(total);
  };

  const handleAddStock = async (newStock) => {
    try {
      await axios.post('http://localhost:5000/stocks', newStock);
      await fetchStocks(); // Fetch updated stocks list
      navigate('/');
    } catch (err) {
      console.error('Error adding stock:', err);
    }
  };

  const handleEditStock = async (updatedStock) => {
    try {
      await axios.put(`http://localhost:5000/stocks/${updatedStock.ticker}`, updatedStock);
      setStocks((prevStocks) =>
        prevStocks.map((stock) =>
          stock.ticker === updatedStock.ticker ? updatedStock : stock
        )
      );
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  const handleDeleteStock = async (ticker) => {
    try {
      await axios.delete(`http://localhost:5000/stocks/${ticker}`);
      setStocks((prevStocks) => prevStocks.filter((stock) => stock.ticker !== ticker));
    } catch (err) {
      console.error('Error deleting stock:', err);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Stock Portfolio</h1>
        <p className="text-xl mb-6">Total Portfolio Value: ${totalValue.toFixed(2)}</p>

        <button onClick={() => navigate('/add-stock')} className="btn btn-primary mb-4">
          Add New Stock
        </button>

        <StockTable
          stocks={stocks}
          onDelete={handleDeleteStock}
          onEdit={handleEditStock}
        />
      </div>
    </div>
  );
};

export default Dashboard;