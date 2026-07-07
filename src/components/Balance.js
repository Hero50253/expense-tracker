import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { formatCurrency } from '../utils/format';

const Balance = () => {
  const { transactions } = useContext(GlobalContext);

  const total = transactions.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="balance-total">
      <span className="balance-label">Your Balance</span>
      <span className="balance-figure">₹{formatCurrency(total)}</span>
    </div>
  );
};

export default Balance;
