import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { GlobalProvider, GlobalContext } from './context/GlobalState';
import Balance from './components/Balance';
import IncomeExpenses from './components/IncomeExpenses';
import ChartComponent from './components/ChartComponent';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';

function AppShell() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const { resetTransactions } = useContext(GlobalContext);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const handleReset = () => {
    if (window.confirm('Clear every entry in the ledger? This cannot be undone.')) {
      resetTransactions();
    }
  };

  return (
    <div className="ledger">
      <header className="ledger-header">
        <div>
          <h1 className="ledger-title">
            <span className="seal">₹</span>Expense Tracker
          </h1>
          <p className="ledger-subtitle">A running record of what comes in and goes out.</p>
        </div>

        <div className="header-actions">
          <button
            className="icon-btn"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {darkMode ? '☀' : '☾'}
          </button>
          <button className="btn-clear" onClick={handleReset}>
            Clear ledger
          </button>
        </div>
      </header>

      <section className="balance-block">
        <Balance />
        <div className="mini-stats">
          <IncomeExpenses />
        </div>
      </section>

      <div className="ledger-grid">
        <div className="col-entries">
          <TransactionList />
        </div>
        <div className="col-side">
          <ChartComponent />
          <AddTransaction />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <GlobalProvider>
      <AppShell />
    </GlobalProvider>
  );
}

export default App;
