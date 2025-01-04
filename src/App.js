import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { PriceProvider } from './context/priceContext';
import Dashboard from './components/DashBoard';
import AddStockPage from './pages/addStockPage';
import EditStock from './components/editStock';
import About from './components/about';
import Layout from './components/Layout';

// Set default axios configuration
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);

  // Fetch stocks on initial load
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('/stocks');
        const stockList = response.data;
        setStocks(stockList);
        setError(null);
      } catch (error) {
        console.error('Error fetching stocks:', error);
        setError('Failed to fetch stocks. Please try again later.');
      }
    };

    fetchStocks();
  }, []); 

  const handleAddStock = async (stockData) => {
    try {
      // Make sure we're sending all required fields
      const response = await axios.post('/stocks', {
        name: stockData.name,
        ticker: stockData.ticker.toUpperCase(),
        quantity: parseInt(stockData.quantity),
        buyPrice: parseFloat(stockData.buyPrice),
        currentPrice: parseFloat(stockData.currentPrice)
      });
      
      // Update local state with the new stock
      setStocks(prevStocks => [...prevStocks, response.data]);
      setError(null);
      return true; // Indicate success
    } catch (error) {
      console.error('Error adding stock:', error);
      setError(error.response?.data?.error || 'Failed to add stock.');
      return false; // Indicate failure
    }
  };

  const handleEditStock = async (updatedStock) => {
    try {
      const response = await axios.put(`/stocks/${updatedStock.ticker}`, updatedStock);
      setStocks((prevStocks) =>
        prevStocks.map((stock) =>
          stock.ticker === updatedStock.ticker ? response.data : stock
        )
      );
      setError(null);
      return true;
    } catch (error) {
      console.error('Error editing stock:', error);
      setError(error.response?.data?.error || 'Failed to edit stock.');
      return false;
    }
  };

  const handleDeleteStock = async (ticker) => {
    try {
      await axios.delete(`/stocks/${ticker}`);
      setStocks((prevStocks) => prevStocks.filter((stock) => stock.ticker !== ticker));
      setError(null);
      return true;
    } catch (error) {
      console.error('Error deleting stock:', error);
      setError(error.response?.data?.error || 'Failed to delete stock.');
      return false;
    }
  };

  return (
    <PriceProvider>
      <Router>
        <Layout>
          {error && (
            <div className="error-message" style={{ color: 'red', padding: '10px' }}>
              {error}
            </div>
          )}
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  stocks={stocks}
                  onDelete={handleDeleteStock}
                  error={error}
                />
              }
            />
            <Route
              path="/add-stock"
              element={
                <AddStockPage
                  onAdd={handleAddStock}
                  error={error}
                />
              }
            />
            <Route
              path="/edit-stock/:ticker"
              element={
                <EditStock
                  stocks={stocks}
                  onEdit={handleEditStock}
                  error={error}
                />
              }
            />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </Router>
    </PriceProvider>
  );
};

export default App;