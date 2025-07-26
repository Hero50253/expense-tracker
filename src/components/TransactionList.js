import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

const TransactionList = () => {
  const { transactions } = useContext(GlobalContext);

  return (
    <div className="bg-white shadow p-4 rounded mb-4">
      <h3 className="text-xl font-semibold mb-3">History</h3>
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className={`flex justify-between items-center border-l-4 p-2 rounded ${
              transaction.amount < 0
                ? "border-red-500 bg-red-100"
                : "border-green-500 bg-green-100"
            }`}
          >
            <span className="font-medium">{transaction.text}</span>
            <span className="font-bold">
              ₹{transaction.amount < 0 ? "-" : "+"}
              {Math.abs(transaction.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;