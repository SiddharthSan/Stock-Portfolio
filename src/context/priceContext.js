import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const PriceContext = createContext();
const POLL_INTERVAL = 60000; // 60 seconds
const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

if (!API_KEY) {
  console.error('Environment variable REACT_APP_ALPHA_VANTAGE_API_KEY is not defined');
}

export const PriceProvider = ({ children }) => {
  const [prices, setPrices] = useState({});
  const [subscribedStocks, setSubscribedStocks] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchStockPrice = useCallback(
    async (ticker) => {
      try {
        const response = await axios.get(
          `https://www.alphavantage.co/query`,
          {
            params: {
              function: 'GLOBAL_QUOTE',
              symbol: ticker,
              apikey: API_KEY,
            },
          }
        );

        const data = response.data['Global Quote'];
        if (data && data['05. price']) {
          return parseFloat(data['05. price']);
        } else {
          console.warn(`Invalid data received for ticker: ${ticker}`);
          return null;
        }
      } catch (error) {
        console.error(`Error fetching price for ${ticker}:`, error.message);
        return null;
      }
    },
    [API_KEY]
  );

  const updatePrices = useCallback(async () => {
    setIsFetching(true);
    const updatedPrices = {};

    for (const ticker of subscribedStocks) {
      const price = await fetchStockPrice(ticker);
      if (price !== null) {
        updatedPrices[ticker] = price;
      }
    }

    setPrices((prev) => ({ ...prev, ...updatedPrices }));
    setIsFetching(false);
  }, [fetchStockPrice, subscribedStocks]);

  const subscribeToStock = useCallback((ticker) => {
    if (!subscribedStocks.includes(ticker)) {
      setSubscribedStocks((prev) => [...prev, ticker]);
      return true;
    }
    return false;
  }, [subscribedStocks]);

  const unsubscribeFromStock = useCallback((ticker) => {
    setSubscribedStocks((prev) => prev.filter((stock) => stock !== ticker));
    setPrices((prev) => {
      const updatedPrices = { ...prev };
      delete updatedPrices[ticker];
      return updatedPrices;
    });
    return true;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updatePrices();
    }, POLL_INTERVAL);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [updatePrices]);

  useEffect(() => {
    updatePrices();
  }, [subscribedStocks, updatePrices]);

  return (
    <PriceContext.Provider
      value={{
        prices,
        subscribeToStock,
        unsubscribeFromStock,
        isFetching,
      }}
    >
      {children}
    </PriceContext.Provider>
  );
};

export const usePrices = () => useContext(PriceContext);
