import React from 'react';
import Navbar from './Navbar';

const About = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <Navbar />
      <div className="container mx-auto p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-500 leading-tight">About</h1>
        
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold mb-4 text-gray-300">About Me</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Hello! I'm Siddharth, a passionate software developer currently pursuing my BTech in Computer Science and Engineering. I enjoy building projects that solve real-world problems, and this stock portfolio tracker is one of my recent creations.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold mb-4 text-gray-300">Project Overview</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            This project is a stock portfolio tracker that allows users to manage their stock investments effectively. It provides a dashboard to view, add, edit, and delete stocks, along with calculating the total portfolio value dynamically.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold mb-4 text-gray-300">Key Features</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg text-gray-400">
            <li className="hover:text-indigo-500 transition-all duration-300">
              Add new stocks with details like name, ticker, quantity, buy price, and current price.
            </li>
            <li className="hover:text-indigo-500 transition-all duration-300">
              Edit stock details such as name, ticker, and quantity.
            </li>
            <li className="hover:text-indigo-500 transition-all duration-300">
              Delete stocks from the portfolio.
            </li>
            <li className="hover:text-indigo-500 transition-all duration-300">
              View total portfolio value, calculated dynamically based on stock data.
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-semibold mb-4 text-gray-300">Project Structure</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            The project uses a JSON file ('stocks.json') as the database to store stock information. The backend is built with Node.js and Express, while the frontend is powered by React. The application is structured as follows:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-lg text-gray-400">
            <li>
              <strong className="text-gray-300">Backend:</strong> Handles API routes for fetching, adding, editing, and deleting stocks. The server reads and writes to `stocks.json` to persist data.
            </li>
            <li>
              <strong className="text-gray-300">Frontend:</strong> Provides a responsive UI for users to interact with their portfolio. Key components include:
              <ul className="list-disc pl-6">
                <li className="hover:text-indigo-500 transition-all duration-300">
                  <strong>Dashboard:</strong> Displays the list of stocks and total portfolio value.
                </li>
                <li className="hover:text-indigo-500 transition-all duration-300">
                  <strong>AddStock:</strong> Form to add new stocks.
                </li>
                <li className="hover:text-indigo-500 transition-all duration-300">
                  <strong>EditStock:</strong> Form to edit existing stock details.
                </li>
              </ul>
            </li>
            <li>
              <strong className="text-gray-300">Integration:</strong> The frontend communicates with the backend using RESTful API calls to perform CRUD operations on the stock data.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
