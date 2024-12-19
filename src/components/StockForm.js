// src/components/StockForm.js
import React, { useState } from 'react';
import axios from 'axios';

const StockForm = ({ stock, onSave }) => {
  const [name, setName] = useState(stock ? stock.name : '');
  const [ticker, setTicker] = useState(stock ? stock.ticker : '');
  const [quantity, setQuantity] = useState(stock ? stock.quantity : '');
  const [buyPrice, setBuyPrice] = useState(stock ? stock.buyPrice : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const stockData = { name, ticker, quantity, buyPrice };
    
    const request = stock ? axios.put(`API_URL/stocks/${stock.id}`, stockData) : axios.post('API_URL/stocks', stockData);

    request.then(response => {
      onSave(response.data);
    }).catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Stock Name" />
      <input type="text" value={ticker} onChange={e => setTicker(e.target.value)} placeholder="Ticker" />
      <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Quantity" />
      <input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} placeholder="Buy Price" />
      <button type="submit">Save Stock</button>
    </form>
  );
};

export default StockForm;
