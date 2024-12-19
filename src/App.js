import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/DashBoard';
import EditStock from './components/editStock';
import AddStock from './components/addStock';
import About from './components/about';

const App = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/stocks')
      .then((response) => response.json())
      .then((data) => setStocks(data))
      .catch((error) => console.error('Error fetching stocks:', error));
  }, []);

  const handleAddStock = (newStock) => {
    fetch('http://localhost:5000/stocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newStock),
    })
      .then((response) => response.json())
      .then((data) => setStocks((prevStocks) => [...prevStocks, data]))
      .catch((error) => console.error('Error adding stock:', error));
  };

  const handleEditStock = (updatedStock) => {
    fetch(`http://localhost:5000/stocks/${updatedStock.ticker}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStock),
    })
      .then((response) => response.json())
      .then(() =>
        setStocks((prevStocks) =>
          prevStocks.map((stock) =>
            stock.ticker === updatedStock.ticker ? updatedStock : stock
          )
        )
      )
      .catch((error) => console.error('Error editing stock:', error));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard stocks={stocks} />} />
        <Route
          path="/add-stock"
          element={<AddStock onAdd={handleAddStock} />}
        />
        <Route
          path="/edit-stock/:ticker"
          element={<EditStock stocks={stocks} onEdit={handleEditStock} />}
        />
        <Route path="/about" element={<About />} /> 
      </Routes>
    </Router>
  );
};

export default App;
