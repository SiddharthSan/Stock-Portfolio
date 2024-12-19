// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'API_URL',  // Replace with your backend URL
  timeout: 10000,
});

export const getStocks = async () => {
  const response = await api.get('/stocks');
  return response.data;
};

export const addStock = async (stockData) => {
  const response = await api.post('/stocks', stockData);
  return response.data;
};

export const updateStock = async (id, stockData) => {
  const response = await api.put(`/stocks/${id}`, stockData);
  return response.data;
};

export const deleteStock = async (id) => {
  const response = await api.delete(`/stocks/${id}`);
  return response.data;
};
