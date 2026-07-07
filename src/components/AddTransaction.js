import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

const AddTransaction = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const { addTransaction } = useContext(GlobalContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || amount === '') return;

    addTransaction({
      id: Date.now(),
      text: text.trim(),
      amount: +amount,
    });

    setText('');
    setAmount('');
  };

  return (
    <div className="card receipt-card">
      <div className="receipt-perforation" aria-hidden="true"></div>
      <h3 className="card-title">New Entry</h3>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="entry-text">Description</label>
          <input
            id="entry-text"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Salary, rent, groceries..."
            required
          />
        </div>
        <div className="field">
          <label htmlFor="entry-amount">
            Amount <span className="hint">(negative for an expense)</span>
          </label>
          <input
            id="entry-amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="-500 or 1000"
            required
          />
        </div>
        <button type="submit" className="btn-primary">
          Record entry
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;
