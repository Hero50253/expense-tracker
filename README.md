# 💎 ExpenseOS — Billion-Dollar Personal Finance Platform

> A minimalist, high-performance personal finance operating system built with React 18, Vite, Express, and MongoDB Atlas. Engineered with luxury slate aesthetics, Framer Motion micro-interactions, an integrated Splitwise engine, circular savings milestones, and AI financial intelligence.

---

## ✨ Features & Architecture

### ⚡ High-Frequency Transaction Ledger
- **Instant Categorization**: Track income and expenses with automatic tag assignments, search filters, and date sorting.
- **Persistent Cloud Sync**: Real-time synchronization with MongoDB Atlas backend on Port 3000.
- **Offline Sandbox Fallback**: Automatic failover to local browser state when operating in offline mode.

### 🤝 Automated Splitwise Engine
- **Multi-Party Shared Groups**: Form custom shared groups (Vacations, Housemates, Dinners) and manage member balances.
- **Automatic Bill Splitting**: Create shared group expenses with automatic equal share distribution among group members.
- **Friends Net Balances**: Real-time net balance calculations (who owes whom) with color-coded balance badges.
- **Settlement Recording**: One-click settlement payment tracking to clear debt balances between friends.

### 📊 Category Caps & Savings Milestones
- **Budget Spending Caps**: Set monthly budget thresholds per category with visual progress bars (`safe`, `warn`, `over-budget`).
- **Circular Savings Rings**: Track visual SVG progress rings toward custom long-term savings goals.
- **Credit Card & Financing Amortization**: Manage active credit card balances, due dates, and monthly EMI payment schedules.

### 🧠 AI Intelligence & Command Palette
- **Command Palette (`Cmd+K`)**: Instant keyboard shortcut modal for rapid navigation and searching across the platform.
- **AI Chat Dock**: Built-in financial advisor for portfolio queries, spending habit audits, and savings strategy recommendations.
- **Notifications Hub**: Dynamic top bar notification badge counter with one-click *"Mark all read"* functionality.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Framer Motion, Recharts, Bootstrap Icons, Google Fonts Inter, Vanilla Luxury CSS System
- **Backend**: Node.js, Express.js, Mongoose (MongoDB Atlas), JWT Authentication, CORS, Dotenv
- **Database**: MongoDB Atlas Cloud (`Cluster0`)

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── models/
│   │   ├── User.js            # JWT User Authentication Schema
│   │   └── Finance.js         # Schemas for Transactions, Budgets, Credit Cards, EMIs, Splitwise
│   ├── routes/
│   │   ├── auth.js            # Register & Login JWT API Routes
│   │   └── api.js             # Financial Data CRUD & Splitwise API Endpoints
│   ├── server.js              # Express Server Entry Point (Port 3000)
│   └── .env                   # Database URI & JWT Secret Configuration
│
└── frontend/
    ├── src/
    │   ├── App.jsx            # Main React Application & State Reducer Engine
    │   ├── index.css          # Luxury Slate System Tokens & Animations
    │   └── main.tsx           # React DOM Mount Entry
    ├── index.html             # Google Fonts Inter & Bootstrap Icons CDN
    └── package.json           # Vite & Dependency Configuration
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MongoDB Atlas Connection URI**

### 2. Backend Setup
```bash
cd backend
npm install
```

Create or verify the `backend/.env` file:
```env
PORT=3000
MONGODB_URI=mongodb+srv://expenseos:NmFn3VyDZtikzdjG@cluster0.durptkd.mongodb.net/?appName=Cluster0
JWT_SECRET=super_secret_jwt_hash_key_change_in_production
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
```

Start the backend dev server:
```bash
npm run dev
```
*Backend runs on `http://localhost:3000`*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend app launches at `http://localhost:5173`*

---

## 📡 REST API Endpoint Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new user account |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` / `POST` / `DELETE` | `/api/transactions` | Manage user transaction records |
| `GET` / `POST` / `DELETE` | `/api/budgets` | Manage category spending caps |
| `GET` / `POST` | `/api/credit-cards` | Manage credit card balances |
| `GET` / `POST` | `/api/emis` | Manage financing EMI schedules |
| `GET` / `POST` / `DELETE` | `/api/splitwise/friends` | Manage Splitwise friends list |
| `GET` / `POST` / `DELETE` | `/api/splitwise/groups` | Manage shared groups |
| `GET` / `POST` / `DELETE` | `/api/splitwise/expenses` | Log multi-party shared bill expenses |
| `GET` / `POST` | `/api/splitwise/settlements` | Record debt settlement payments |

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

