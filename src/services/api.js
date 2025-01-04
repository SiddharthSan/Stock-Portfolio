// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000',
  timeout: 10000,
});

const handleApiError = (error) => {
  console.error(error.message);
  throw new Error(error.response?.data?.error || 'API request failed.');
};

export const getStocks = async () => {
  try {
    const response = await api.get('/stocks');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const addStock = async (stockData) => {
  try {
    const response = await api.post('/stocks', stockData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateStock = async (ticker, stockData) => {
  try {
    const response = await api.put(`/stocks/${ticker}`, stockData);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteStock = async (ticker) => {
  try {
    const response = await api.delete(`/stocks/${ticker}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getLivePrice = async (ticker) => {
  try {
    const response = await api.get(`/live-price/${ticker}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
