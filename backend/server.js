const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

dotenv.config();

const app = express();
const PORT = 5000;

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

// Fetch all stocks
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

// Add a new stock
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

// Edit a stock
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

// Delete a stock
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  db.end();
  process.exit(0);
});