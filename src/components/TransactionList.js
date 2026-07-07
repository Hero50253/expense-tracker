import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalState';
import { formatCurrency, formatEntryDate } from '../utils/format';

const TransactionList = () => {
  const { transactions, deleteTransaction } = useContext(GlobalContext);
  const [removingIds, setRemovingIds] = useState([]);

  const handleDelete = (id) => {
    setRemovingIds((prev) => [...prev, id]);
    // let the strike-through/fade animation play before it actually leaves state
    setTimeout(() => {
      deleteTransaction(id);
      setRemovingIds((prev) => prev.filter((rid) => rid !== id));
    }, 280);
  };

  const total = transactions.length;

  return (
    <div className="card entries-card">
      <h3 className="card-title">Ledger Entries</h3>

      {total === 0 ? (
        <p className="empty-state">No entries yet — record your first one on the right.</p>
      ) : (
        <ul className="ledger-list">
          {transactions.map((transaction, index) => {
            const isDebit = transaction.amount < 0;
            const serial = String(total - index).padStart(3, '0');
            const isRemoving = removingIds.includes(transaction.id);

            return (
              <li
                key={transaction.id}
                className={`ledger-row ${isDebit ? 'debit' : 'credit'} ${
                  isRemoving ? 'removing' : ''
                }`}
              >
                <span className="ledger-no">No.{serial}</span>
                <span className="ledger-date">{formatEntryDate(transaction.id)}</span>
                <span className="ledger-text">{transaction.text}</span>
                <span className={`ledger-amount ${isDebit ? 'debit' : 'credit'}`}>
                  {isDebit ? '-' : '+'}₹{formatCurrency(Math.abs(transaction.amount))}
                </span>
                <button
                  className="ledger-delete"
                  onClick={() => handleDelete(transaction.id)}
                  aria-label={`Delete entry: ${transaction.text}`}
                  title="Delete entry"
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
