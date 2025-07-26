import React, { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

const AddTransaction = () => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const { addTransaction } = useContext(GlobalContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      id: Date.now(),
      text,
      amount: +amount, // convert string to number
    };

    addTransaction(newTransaction);
    setText("");
    setAmount("");
  };

  return (
    <div className="bg-white shadow p-4 rounded mb-4">
      <h3 className="text-xl font-semibold mb-2">Add new transaction</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block font-medium">Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Salary, Book, Rent..."
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">
            Amount <span className="text-sm text-gray-500">(use - for expense)</span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="-500 or 1000"
            className="w-full p-2 border rounded mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default AddTransaction;