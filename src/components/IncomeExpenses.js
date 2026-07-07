import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { formatCurrency } from '../utils/format';

const IncomeExpenses = () => {
  const { transactions } = useContext(GlobalContext);

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const expense =
    transactions.filter((t) => t.amount < 0).reduce((acc, t) => acc + t.amount, 0) * -1;

  return (
    <>
      <div className="stat credit">
        <span className="stat-label">
          Income<em>Cr</em>
        </span>
        <span className="stat-figure">₹{formatCurrency(income)}</span>
      </div>
      <div className="stat debit">
        <span className="stat-label">
          Expense<em>Dr</em>
        </span>
        <span className="stat-figure">₹{formatCurrency(expense)}</span>
      </div>
    </>
  );
};

export default IncomeExpenses;
