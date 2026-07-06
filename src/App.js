import React, { useState, useEffect } from "react";
import "./App.css";

import { GlobalProvider } from "./context/GlobalState";

import Balance from "./components/Balance";
import IncomeExpenses from "./components/IncomeExpenses";
import ChartComponent from "./components/ChartComponent";
import TransactionList from "./components/TransactionList";
import AddTransaction from "./components/AddTransaction";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <GlobalProvider>
      <div className="app">

        <header className="topbar">

          <div>
            <h1>ExpenseOS</h1>
            <p>Your Personal Finance Dashboard</p>
          </div>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

        </header>

        <main className="dashboard">

        <Balance />

<IncomeExpenses />

<ChartComponent />

<TransactionList />

<AddTransaction />

        </main>

      </div>
    </GlobalProvider>
  );
}

export default App;