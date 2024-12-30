import React, { useState } from 'react';

const StockTable = ({ stocks, onDelete, onEdit }) => {
  const [editingStock, setEditingStock] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEditClick = (stock) => {
    setEditingStock(stock);
    setFormData(stock);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSaveClick = () => {
    onEdit(formData);
    setEditingStock(null);
  };

  const calculateTotalValue = (stock, isEditing) => {
    if (isEditing) {
      return (formData.quantity * stock.currentPrice).toFixed(2);
    }
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
          {stocks.map((stock) => {
            const isEditing = editingStock?.ticker === stock.ticker;
            return (
              <tr key={stock.ticker} className="hover:bg-gray-700">
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name || stock.name}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm w-full max-w-xs bg-gray-800 text-white"
                    />
                  ) : (
                    stock.name
                  )}
                </td>
                <td>{stock.ticker}</td>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity || stock.quantity}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm w-full max-w-xs bg-gray-800 text-white"
                    />
                  ) : (
                    stock.quantity
                  )}
                </td>
                <td>${parseFloat(stock.buyPrice).toFixed(2)}</td>
                <td>${parseFloat(stock.currentPrice).toFixed(2)}</td>
                <td>${calculateTotalValue(stock, isEditing)}</td>
                <td>
                  {isEditing ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handleSaveClick}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleEditClick(stock)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm ml-2"
                        onClick={() => onDelete(stock.ticker)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
