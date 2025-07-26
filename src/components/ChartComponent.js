// src/components/ChartComponent.js
import React, { useContext } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { GlobalContext } from "../context/GlobalState";

const COLORS = ["#00C49F", "#FF8042"]; // income = green, expense = orange

const ChartComponent = () => {
  const { transactions } = useContext(GlobalContext);

  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const data = [
    { name: "Income", value: income },
    { name: "Expense", value: expense },
  ];

  // If there's no data, don't show chart
  if (income === 0 && expense === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 my-4">
      <h2 className="text-lg font-semibold mb-3 text-center dark:text-white">
        Income vs Expense
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
