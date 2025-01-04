import React from 'react';

const StockTable = ({ stocks, onDelete, onEdit }) => {
  const calculateTotalValue = (stock) => {
    return (stock.quantity * stock.currentPrice).toFixed(2);
  };

  return (
    <div className="overflow-x-auto bg-gray-900 text-white">
      <table className="table table-zebra w-full">
        <thead className="bg-gray-800">
          <tr>
            <th className="text-indigo-300">Stock Name</th>
            <th className="text-indigo-300">Ticker</th>
            <th className="text-indigo-300">Quantity</th>
            <th className="text-indigo-300">Buy Price</th>
            <th className="text-indigo-300">Current Price</th>
            <th className="text-indigo-300">Total Value</th>
            <th className="text-indigo-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.ticker} className="hover:bg-gray-700">
              <td>{stock.name}</td>
              <td>{stock.ticker}</td>
              <td>{stock.quantity}</td>
              <td>${parseFloat(stock.buyPrice).toFixed(2)}</td>
              <td>${parseFloat(stock.currentPrice).toFixed(2)}</td>
              <td>${calculateTotalValue(stock)}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onEdit(stock)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm ml-2"
                  onClick={() => onDelete(stock.ticker)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
