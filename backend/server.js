// server.js
const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = 5000;
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

// MySQL connection with better error handling
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'PortfolioTracker',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL Database.');
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// New endpoint for fetching live stock prices
app.get('/live-price/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    
    // First try to get from Alpha Vantage
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );

      if (response.data['Global Quote']) {
        const price = parseFloat(response.data['Global Quote']['05. price']);
        res.json({ 
          livePrice: price,
          change: parseFloat(response.data['Global Quote']['09. change']),
          changePercent: parseFloat(response.data['Global Quote']['10. change percent'].replace('%', '')),
          source: 'alphavantage'
        });
        
        // Update the price in database
        const updateQuery = 'UPDATE stocks SET currentPrice = ? WHERE ticker = ?';
        db.query(updateQuery, [price, ticker]);
        
        return;
      }
    } catch (alphaVantageError) {
      console.warn('Alpha Vantage API error:', alphaVantageError.response?.data || alphaVantageError.message);
    }

    // If Alpha Vantage fails, get price from database
    const query = 'SELECT currentPrice, buyPrice FROM stocks WHERE ticker = ?';
    db.query(query, [ticker], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        const dbPrice = results[0].currentPrice;
        // Use the last stored price and indicate no change since we don't have real-time data
        res.json({
          livePrice: dbPrice,
          change: 0,
          changePercent: 0,
          source: 'database'
        });
      } else {
        res.status(404).json({ error: 'Stock not found in database' });
      }
    });
  } catch (error) {
    console.error('Error in live-price endpoint:', error);
    res.status(500).json({ error: 'Failed to fetch stock price' });
  }
});
// Existing endpoints...
app.get('/stocks', async (req, res) => {
  try {
    db.query('SELECT * FROM stocks', (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/stocks', (req, res) => {
  try {
    const { name, ticker, quantity, buyPrice, currentPrice } = req.body;

    if (!name || !ticker || !quantity || !buyPrice || !currentPrice) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const query =
      'INSERT INTO stocks (name, ticker, quantity, buyPrice, currentPrice) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, ticker, quantity, buyPrice, currentPrice], (err, result) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: result.insertId, name, ticker, quantity, buyPrice, currentPrice });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/stocks/:ticker', (req, res) => {
  try {
    const { name, quantity, buyPrice, currentPrice } = req.body;
    const { ticker } = req.params;

    if (!name || !quantity || !buyPrice || !currentPrice) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const query =
      'UPDATE stocks SET name = ?, quantity = ?, buyPrice = ?, currentPrice = ? WHERE ticker = ?';
    db.query(query, [name, quantity, buyPrice, currentPrice, ticker], (err, result) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Stock not found' });
      }
      res.json({ ticker, name, quantity, buyPrice, currentPrice });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/stocks/:ticker', (req, res) => {
  try {
    const { ticker } = req.params;
    const query = 'DELETE FROM stocks WHERE ticker = ?';
    db.query(query, [ticker], (err, result) => {
      if (err) {
        console.error('Database delete error:', err);
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Stock not found' });
      }
      res.status(204).send();
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  db.end();
  process.exit(0);
});
