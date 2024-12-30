import React, { useEffect, useState } from 'react';
import { usePrices } from './context/priceContext';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import About from './components/about';
import EditStock from './components/editStock';
import Dashboard from './components/DashBoard';
import AddStockPage from './pages/addStockPage';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

const App = () => {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState(null);
  const { subscribeToStock, unsubscribeFromStock } = usePrices();

  // Fetch initial stocks data and subscribe to updates
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('/stocks');
        setStocks(response.data);
        // Subscribe to price updates for each stock
        response.data.forEach(stock => subscribeToStock(stock.ticker));
        setError(null);
      } catch (error) {
        console.error('Error fetching stocks:', error);
        setError('Failed to fetch stocks. Please try again later.');
      }
    };

    fetchStocks();

    // Cleanup function
    const currentStocks = [...stocks]; // Create a copy for cleanup
    return () => {
      currentStocks.forEach(stock => unsubscribeFromStock(stock.ticker));
    };
  }, [subscribeToStock, unsubscribeFromStock]);

  const handleAddStock = async (newStock) => {
    try {
      const response = await axios.post('/stocks', newStock);
      const addedStock = response.data;
      setStocks(prevStocks => [...prevStocks, addedStock]);
      subscribeToStock(addedStock.ticker);
      setError(null);
      return true; // Indicate success
    } catch (error) {
      console.error('Error adding stock:', error);
      setError(error.response?.data?.error || 'Failed to add stock');
      return false; // Indicate failure
    }
  };

  const handleEditStock = async (updatedStock) => {
    try {
      const response = await axios.put(
        `/stocks/${updatedStock.ticker}`,
        updatedStock
      );
      setStocks(prevStocks =>
        prevStocks.map(stock =>
          stock.ticker === updatedStock.ticker ? response.data : stock
        )
      );
      setError(null);
      return true;
    } catch (error) {
      console.error('Error editing stock:', error);
      setError(error.response?.data?.error || 'Failed to edit stock');
      return false;
    }
  };

  const handleDeleteStock = async (ticker) => {
    try {
      await axios.delete(`/stocks/${ticker}`);
      setStocks(prevStocks => prevStocks.filter(stock => stock.ticker !== ticker));
      unsubscribeFromStock(ticker);
      setError(null);
      return true;
    } catch (error) {
      console.error('Error deleting stock:', error);
      setError(error.response?.data?.error || 'Failed to delete stock');
      return false;
    }
  };

  // Error display component
  const ErrorMessage = () => error ? (
    <div className="error-message" style={{ color: 'red', padding: '10px' }}>
      {error}
    </div>
  ) : null;

  return (
    <Router>
      <div className="app-container">
        <ErrorMessage />
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
      </div>
    </Router>
  );
};

export default App;