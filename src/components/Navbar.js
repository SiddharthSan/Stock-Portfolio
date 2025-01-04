import React from 'react';

function Navbar() {
  return (
    <div className="navbar bg-gray-800 shadow-lg p-4 text-white">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-xl font-semibold hover:text-gray-400">
          <span className="hidden lg:inline">Portfolio Tracker</span>
        </a>
      </div>
      <div className="navbar-center hidden lg:flex">
        {/* Optionally, you could add more items here for larger screens */}
      </div>
      <div className="navbar-end">
        <a href="/" className="btn btn-ghost hover:text-gray-400">Home</a>
        <a href="/add-stock" className="btn btn-ghost hover:text-gray-400">Add new Stock</a>
        <a href="/about" className="btn btn-ghost hover:text-gray-400">About</a>
      </div>
    </div>
  );
}

export default Navbar;
