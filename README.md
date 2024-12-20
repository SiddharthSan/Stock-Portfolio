# Portfolio Tracker Application

This is a simple Portfolio Tracker application designed to allow users to manage their stock holdings effectively. The application supports adding, viewing, editing, and deleting stock details while dynamically calculating the total portfolio value.

---

## Features
- **Dashboard**: View key portfolio metrics, including total value and individual stock details.
- **CRUD Operations**: Add, edit, and delete stock holdings.
- **Real-Time Calculations**: Portfolio value updates dynamically based on the stock data.
- **User-Friendly Interface**: A responsive web application built with React.

---

## Project Structure
### **Frontend**:
- Built with React.js for a responsive and intuitive user interface.
- Components:
  - `Dashboard`: Displays the stock portfolio and total value.
  - `AddStock`: Form to add new stock holdings.
  - `EditStock`: Form to edit existing stock details.
  - `StockTable`: Displays the list of stocks with edit and delete options.
  - `About`: Provides an overview of the project.

### **Backend**:
- Node.js with Express for handling API requests.
- API Endpoints:
  - `GET /stocks`: Fetch all stocks.
  - `POST /stocks`: Add a new stock.
  - `PUT /stocks/:ticker`: Update an existing stock.
  - `DELETE /stocks/:ticker`: Delete a stock.
- Data Storage:
  - `stocks.json` serves as the database, storing all stock information.

---

## Steps to Run Locally
### **Prerequisites**
- Node.js installed on your system.
- A code editor like VS Code.
- A browser to access the application.

### **Setup Instructions**
1. Clone the repository:
   ```bash
   git clone https://github.com/SiddharthSan/Stock-Portfolio.git
   cd Stock-Portfolio
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   npm install
   cd backend
   npm install
   ```

3. Start the backend server:
   ```bash
   cd backend
   node index.js
   ```
   By default, the backend runs on `http://localhost:5000`.

4. Start the frontend development server:
   ```bash
   cd ..
   npm start
   ```
   The frontend will run on `http://localhost:3000`.

5. Open the browser and navigate to `http://localhost:3000` to use the application.

---

## Assumptions and Limitations
### **Assumptions**
- The `stocks.json` file serves as the database and resets if deleted.
- Real-time stock prices are not integrated due to time constraints.
- Users must manually provide the current price when adding/editing a stock.

### **Limitations**
- No authentication or user-based data segregation.
- Not scalable for production due to the use of `stocks.json` as storage.
- Deployment is limited to platforms that support file-based storage.

---

## API Documentation
### Base URL:
`http://localhost:5000`

### Endpoints:
1. **GET /stocks**
   - Fetch all stock holdings.

2. **POST /stocks**
   - Add a new stock.
   - Request Body:
     ```json
     {
       "name": "Stock Name",
       "ticker": "TICKER",
       "quantity": 10,
       "buyPrice": 100.50,
       "currentPrice": 120.75
     }
     ```

3. **PUT /stocks/:ticker**
   - Update an existing stock.
   - Request Body:
     ```json
     {
       "quantity": 15,
       "buyPrice": 105.00,
       "currentPrice": 125.00
     }
     ```

4. **DELETE /stocks/:ticker**
   - Delete a stock by its ticker.

---
