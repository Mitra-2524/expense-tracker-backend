import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function App() {
  const [data, setData] = useState(null);
  const [month, setMonth] = useState(2);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const year = 2026;

  const fetchData = () => {
    setData(null);
    fetch(
      `http://127.0.0.1:8000/analytics/monthly?year=${year}&month=${month}`
    )
      .then((res) => res.json())
      .then((json) => setData(json));
  };

  useEffect(fetchData, [month]);

  const addExpense = async () => {
    await fetch("http://127.0.0.1:8000/add-expense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(amount),
        description,
      }),
    });

    setAmount("");
    setDescription("");
    fetchData();
  };

  const chartData =
    data &&
    Object.entries(data.by_category).map(([name, value]) => ({
      name,
      value,
    }));

  return (
  <div
    style={{
      padding: 24,
      fontFamily: "Arial",
      background: "#121212",
      minHeight: "100vh",
      color: "white",
    }}
  >

      <h1>Smart Expense Tracker</h1>
      

      {/* Add Expense */}
      <h3>Add Expense</h3>
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={addExpense}>Add</button>

      <hr />

      {/* Month Selector */}
      <label>
        Select Month:{" "}
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Month {i + 1}
            </option>
          ))}
        </select>
      </label>

      {!data && <p>Loading analytics...</p>}

      {data && (
        <>
          <h2>{year}-{month} Summary</h2>
          <h3>Total Spent: ₹{data.total_spent}</h3>

          <PieChart width={400} height={300}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </>
      )}
    </div>
  );
}
