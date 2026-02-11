import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

// 🔹 Render backend URL
const API_BASE = "https://expense-tracker-backend-91nt.onrender.com";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function App() {
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  // 🔹 Fetch expenses and build analytics
  const fetchExpenses = async () => {
    const res = await fetch(`${API_BASE}/expenses`);
    const expenses = await res.json();

    const byCategory = {};
    let total = 0;

    expenses.forEach((e) => {
      total += e.amount;
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    setData({
      total_spent: total,
      by_category: byCategory,
    });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 🔹 Add expense (ML predicts category automatically)
  const addExpense = async () => {
    if (!description || !amount) return;

    // 1️⃣ Predict category
    const predictRes = await fetch(
      `${API_BASE}/predict-category?description=${description}`,
      { method: "POST" }
    );
    const predictData = await predictRes.json();

    // 2️⃣ Add expense
    await fetch(
      `${API_BASE}/expenses?amount=${amount}&category=${predictData.predicted_category}&description=${description}`,
      { method: "POST" }
    );

    setAmount("");
    setDescription("");
    fetchExpenses();
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
        style={{ marginRight: 8 }}
      />
      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <button onClick={addExpense}>Add</button>

      <hr />

      {!data && <p>Loading analytics...</p>}

      {data && (
        <>
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

