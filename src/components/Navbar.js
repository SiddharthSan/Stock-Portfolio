import React from 'react';

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-lg rounded-lg p-4">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-xl font-semibold text-slate-200 hover:text-gray-400">
          Portfolio Tracker
        </a>
      </div>
      <div className="navbar-center">
      </div>
      <div className="navbar-end">
        <a href="/" className="btn btn-ghost text-slate-200 hover:text-gray-400">Home</a>
        <a href="/add-stock" className="btn btn-ghost text-slate-200 hover:text-gray-400">Add new Stock</a>
        <a href="/about" className="btn btn-ghost text-slate-200 hover:text-gray-400">About</a>
      </div>
    </div>
  );
}

export default Navbar;
