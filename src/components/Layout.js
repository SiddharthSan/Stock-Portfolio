import React from 'react';
import { usePrices } from '../context/priceContext';

const Layout = ({ children }) => {
  const { isFetching } = usePrices();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="app-container">
        {children}
      </div>
      {isFetching && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow">
          Updating prices...
        </div>
      )}
    </div>
  );
};

export default Layout;
