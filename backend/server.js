const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Path to the stocks.json file
const stocksFilePath = path.join(__dirname, 'stocks.json');

// Fetch all stocks
app.get('/stocks', (req, res) => {
  fs.readFile(stocksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading stocks file' });
    }
    res.json(JSON.parse(data));
  });
});

// Add a new stock
app.post('/stocks', (req, res) => {
  const newStock = req.body;
  fs.readFile(stocksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading stocks file' });
    }
    const stocks = JSON.parse(data);
    stocks.push(newStock);
    fs.writeFile(stocksFilePath, JSON.stringify(stocks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to stocks file' });
      }
      res.status(201).json(newStock);
    });
  });
});

// Edit a stock
app.put('/stocks/:ticker', (req, res) => {
  const updatedStock = req.body;
  const ticker = req.params.ticker;
  fs.readFile(stocksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading stocks file' });
    }
    let stocks = JSON.parse(data);
    stocks = stocks.map((stock) =>
      stock.ticker === ticker ? updatedStock : stock
    );
    fs.writeFile(stocksFilePath, JSON.stringify(stocks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to stocks file' });
      }
      res.json(updatedStock);
    });
  });
});

// Delete a stock
app.delete('/stocks/:ticker', (req, res) => {
  const ticker = req.params.ticker;
  fs.readFile(stocksFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading stocks file' });
    }
    let stocks = JSON.parse(data);
    stocks = stocks.filter((stock) => stock.ticker !== ticker);
    fs.writeFile(stocksFilePath, JSON.stringify(stocks, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error writing to stocks file' });
      }
      res.status(204).send();
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
