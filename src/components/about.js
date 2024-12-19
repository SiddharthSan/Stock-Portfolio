import React from 'react';
import Navbar from './Navbar';

const About = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">About</h1>
        
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">About Me</h2>
          <p className="text-lg">
            Hello! I'm Siddharth, a passionate software developer currently pursuing my BTech in Computer Science and Engineering. I enjoy building projects that solve real-world problems, and this stock portfolio tracker is one of my recent creations.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Project Overview</h2>
          <p className="text-lg">
            This project is a stock portfolio tracker that allows users to manage their stock investments effectively. It provides a dashboard to view, add, edit, and delete stocks, along with calculating the total portfolio value dynamically.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
          <ul className="list-disc pl-6 text-lg">
            <li>Add new stocks with details like name, ticker, quantity, buy price, and current price.</li>
            <li>Edit stock details such as name and quantity.</li>
            <li>Delete stocks from the portfolio.</li>
            <li>View total portfolio value, calculated dynamically based on stock data.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Project Structure</h2>
          <p className="text-lg">
            The project uses a JSON file ('stocks.json') as the database to store stock information. The backend is built with Node.js and Express, while the frontend is powered by React. The application is structured as follows:
          </p>
          <ul className="list-disc pl-6 text-lg">
            <li>
              <strong>Backend:</strong> Handles API routes for fetching, adding, editing, and deleting stocks. The server reads and writes to `stocks.json` to persist data.
            </li>
            <li>
              <strong>Frontend:</strong> Provides a responsive UI for users to interact with their portfolio. Key components include:
              <ul className="list-disc pl-6">
                <li><strong>Dashboard:</strong> Displays the list of stocks and total portfolio value.</li>
                <li><strong>AddStock:</strong> Form to add new stocks.</li>
                <li><strong>EditStock:</strong> Form to edit existing stock details.</li>
              </ul>
            </li>
            <li>
              <strong>Integration:</strong> The frontend communicates with the backend using RESTful API calls to perform CRUD operations on the stock data.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default About;
