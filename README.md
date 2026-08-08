# ExpenseOS

A full-stack expense management and personal finance application built with React, Vite, Express, and MongoDB Atlas. Features include transaction tracking, category budgets, credit/EMI schedules, and a Splitwise bill-splitting engine.

---

## Features

### Transaction Management
- Categorized income and expense logging with live search and filtering.
- Automatic synchronization with MongoDB Atlas backend.
- Fallback local storage state for offline usage.

### Splitwise Engine
- Shared group creation for splitting expenses among multiple members.
- Automatic equal share calculations and net friend balance tracking.
- Settlement recording to log payments between friends.

### Budgets & Savings Tracking
- Monthly category spending caps with visual progress status.
- Circular progress indicators for savings goals.
- Credit card balance tracking and financing EMI schedule management.

### Interface & Tools
- Keyboard shortcut command palette (`Cmd+K`) for fast navigation.
- Financial chat assistant interface for spending queries.
- Top bar notification bell with unread badge counter and clear-all controls.

---

## Tech Stack

- **Frontend**: React 18, Vite, Framer Motion, Recharts, Bootstrap Icons, CSS
- **Backend**: Node.js, Express.js, Mongoose, JWT Authentication
- **Database**: MongoDB Atlas

---

## Project Structure

```text
expense-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js            # User auth schema
│   │   └── Finance.js         # Transaction, budget, credit card, EMI & Splitwise schemas
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── api.js             # Financial & Splitwise endpoints
│   └── server.js              # Express server setup (Port 3000)
│
└── frontend/
    ├── src/
    │   ├── App.jsx            # Main React application & state management
    │   ├── index.css          # Styling & design system utilities
    │   └── main.tsx           # Entry point
    ├── index.html
    └── package.json
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- MongoDB Atlas database URI

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hero50253/expense-tracker.git
   cd expense-tracker
   ```

2. **Configure and start the Backend**
   ```bash
   cd backend
   npm install
   ```
   Ensure `.env` contains:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/expense_os?retryWrites=true&w=majority
   JWT_SECRET=your_production_jwt_secret_key_here
   NODE_ENV=development
   CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
   ```
   Start server:
   ```bash
   npm run dev
   ```

3. **Start the Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new account |
| `POST` | `/api/auth/login` | Log in and receive JWT token |
| `GET` / `POST` / `DELETE` | `/api/transactions` | Manage transactions |
| `GET` / `POST` / `DELETE` | `/api/budgets` | Manage category budgets |
| `GET` / `POST` | `/api/credit-cards` | Manage credit card balances |
| `GET` / `POST` | `/api/emis` | Manage EMI schedules |
| `GET` / `POST` / `DELETE` | `/api/splitwise/friends` | Manage Splitwise friends |
| `GET` / `POST` / `DELETE` | `/api/splitwise/groups` | Manage shared groups |
| `GET` / `POST` / `DELETE` | `/api/splitwise/expenses` | Manage shared group expenses |
| `GET` / `POST` | `/api/splitwise/settlements` | Record debt settlements |

---

## License

This project is licensed under the MIT License.
