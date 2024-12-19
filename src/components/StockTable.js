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
      [name]: name === 'quantity' ? parseFloat(value) || 0 : value 
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
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Stock Name</th>
            <th>Ticker</th>
            <th>Quantity</th>
            <th>Buy Price</th>
            <th>Current Price</th>
            <th>Total Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => {
            const isEditing = editingStock?.ticker === stock.ticker;
            return (
              <tr key={stock.ticker}>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm w-full max-w-xs"
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
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm w-full max-w-xs"
                    />
                  ) : (
                    stock.quantity
                  )}
                </td>
                <td>${stock.buyPrice.toFixed(2)}</td>
                <td>${stock.currentPrice.toFixed(2)}</td>
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