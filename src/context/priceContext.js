// context/priceContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const PriceContext = createContext();

export const PriceProvider = ({ children }) => {
  const [prices, setPrices] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [priceSource, setPriceSource] = useState({});

  const fetchStockPrice = useCallback(async (ticker) => {
    try {
      const response = await axios.get(`/live-price/${ticker}`);
      if (response.data) {
        setPrices(prev => ({
          ...prev,
          [ticker]: {
            price: response.data.livePrice,
            change: response.data.change,
            changePercent: response.data.changePercent
          }
        }));
        setPriceSource(prev => ({
          ...prev,
          [ticker]: response.data.source
        }));
        setErrors(prev => ({ ...prev, [ticker]: null }));
      }
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error);
      setErrors(prev => ({ ...prev, [ticker]: 'Failed to fetch price' }));
    }
  }, []);

  const subscribeToStock = useCallback((ticker) => {
    fetchStockPrice(ticker);
    // Only set up polling if we're getting data from Alpha Vantage
    if (priceSource[ticker] === 'alphavantage') {
      const interval = setInterval(() => fetchStockPrice(ticker), 300000);
      return () => clearInterval(interval);
    }
    return () => {}; // No cleanup needed if using database prices
  }, [fetchStockPrice, priceSource]);

  const unsubscribeFromStock = useCallback((ticker) => {
    setPrices(prev => {
      const newPrices = { ...prev };
      delete newPrices[ticker];
      return newPrices;
    });
    setPriceSource(prev => {
      const newSources = { ...prev };
      delete newSources[ticker];
      return newSources;
    });
  }, []);

  const getCurrentPrice = async (ticker) => {
    setIsFetching(true);
    try {
      const response = await axios.get(`/live-price/${ticker}`);
      if (response.data) {
        return response.data.livePrice;
      }
      return null;
    } catch (error) {
      console.error(`Error fetching price for ${ticker}:`, error);
      throw new Error('Failed to fetch current price');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <PriceContext.Provider value={{
      prices,
      errors,
      isFetching,
      priceSource,
      subscribeToStock,
      unsubscribeFromStock,
      getCurrentPrice
    }}>
      {children}
    </PriceContext.Provider>
  );
};

export const usePrices = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrices must be used within a PriceProvider');
  }
  return context;
};