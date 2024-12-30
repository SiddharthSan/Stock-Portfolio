import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000', // Use env variable for flexibility
  timeout: 10000,
});

// Fetch all stocks
export const getStocks = async () => {
  try {
    const response = await api.get('/stocks');
    return response.data;
  } catch (error) {
    console.error('Error fetching stocks:', error);
    throw new Error('Failed to fetch stocks.');
  }
};

// Add a new stock
export const addStock = async (stockData) => {
  try {
    const response = await api.post('/stocks', stockData);
    return response.data;
  } catch (error) {
    console.error('Error adding stock:', error);
    throw new Error('Failed to add stock.');
  }
};

// Update a stock by ticker
export const updateStock = async (ticker, stockData) => {
  try {
    const response = await api.put(`/stocks/${ticker}`, stockData);
    return response.data;
  } catch (error) {
    console.error(`Error updating stock with ticker ${ticker}:`, error);
    throw new Error('Failed to update stock.');
  }
};

// Delete a stock by ticker
export const deleteStock = async (ticker) => {
  try {
    const response = await api.delete(`/stocks/${ticker}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting stock with ticker ${ticker}:`, error);
    throw new Error('Failed to delete stock.');
  }
};
