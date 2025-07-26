import React, { useState, useEffect } from 'react';
import './App.css';
import { GlobalProvider } from "./context/GlobalState";
import Balance from "./components/Balance";
import IncomeExpenses from "./components/IncomeExpenses";
import ChartComponent from "./components/ChartComponent";
import TransactionList from "./components/TransactionList";
import AddTransaction from "./components/AddTransaction";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <GlobalProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 dark:text-white">
          💸 Expense Tracker
        </h1>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setDarkMode(prev => !prev)}
          className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white py-1 px-3 rounded mb-4 transition-all block mx-auto"
        >
          Switch to {darkMode ? 'Light' : 'Dark'} Mode
        </button>

        <Balance />
        <IncomeExpenses />
        <ChartComponent />
        <TransactionList />
        <AddTransaction />
      </div>
    </GlobalProvider>
  );
}

export default App;
