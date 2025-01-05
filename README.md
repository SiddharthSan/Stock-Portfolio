# Stock Portfolio Tracker
## Overview
The Stock Portfolio Tracker is a web-based application that allows users to manage their stock investments efficiently. It provides an intuitive interface to view, add, edit, and delete stock data, as well as calculate the total value of a user's stock portfolio dynamically. The application is built using **React** for the frontend and **Node.js/Express** for the backend, with data stored in **MySQL** database.

### Key Features:
- **Add Stock**: Add new stocks with essential details like name, ticker symbol, quantity, buy price, and current price.
- **Edit Stock**: Modify existing stock details such as quantity, buy price, and name.
- **Delete Stock**: Remove stocks from the portfolio.
- **Total Portfolio Value**: Dynamically calculate the total value of the portfolio based on live stock prices fetched from the Alpha Vantage API.
- **Responsive Design**: The app is mobile-friendly, providing an optimal experience across various devices.

---
## Limitations
- **API Request Limit**: The free version of Alpha Vantage API allows only 5 requests per minute. This means:
  - You can only fetch current prices for 5 different stocks per minute
  - Additional requests will be rejected until the minute window resets
---
## Tech Stack
- **Frontend**: React.js  
- **Backend**: Node.js, Express  
- **API**: Alpha Vantage (Free version for fetching live stock prices)  
- **Data**: MySQL database to store the data

---
## Prerequisites
1. **Node.js and npm** installed on your machine.
2. **Alpha Vantage API Key**: To fetch real-time stock data (register for a free key at [Alpha Vantage](https://www.alphavantage.co/)).
3. **MySQL** installed and running on your machine.

---
## Getting Started
1. **Clone the repository**:
   ```bash
   git clone https://github.com/YourUsername/portfolio-tracker.git
   cd portfolio-tracker
   ```

2. **Install dependencies**:
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   ALPHA_VANTAGE_API_KEY=your_api_key_here
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=PortfolioTracker
   ```

4. **Set up the database**:
   ```bash
   # Log into MySQL
   mysql -u root -p

   # Run the schema.sql file to create the database and tables
   source path/to/schema.sql
   ```


5. **Start the application**:
   ```bash
   # Start the backend server (from the backend directory)
   node server.js

   # In a new terminal, start the frontend (from the root directory)
   npm start
   ```

6. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

---
## Project Structure
```
portfolio-tracker/
├── src/                  # Frontend source files
├── public/              # Static files
├── backend/             # Backend source files
│   ├── config/         # Database configuration
│   ├── routes/         # API routes
│   ├── models/         # Database models
│   ├── schema.sql      # Database schema
│   └── server.js       # Server entry point
└── package.json        # Project dependencies
```

---
## API Endpoints
- `GET /api/stocks` - Get all stocks
- `POST /api/stocks` - Add new stock
- `PUT /api/stocks/:id` - Update stock
- `DELETE /api/stocks/:id` - Delete stock
- `GET /api/portfolio/value` - Get total portfolio value

---
