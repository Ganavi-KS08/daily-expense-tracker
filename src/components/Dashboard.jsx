import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import ExpenseChart from "./ExpenseChart";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import Summary from "./Summary";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Dashboard({ session }) {
  const [expenses, setExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");

  // 🔹 Budget states
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    fetchBudget();
  }, [selectedMonth]);

  // ================= FETCH EXPENSES =================
  const fetchExpenses = async () => {
    const { data } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", session.user.id)
      .order("date", { ascending: false });

    setExpenses(data || []);
  };

  // ================= FETCH BUDGET =================
  const fetchBudget = async () => {
    const monthValue =
      selectedMonth === "All"
        ? new Date().getMonth()
        : Number(selectedMonth);

    const { data } = await supabase
      .from("budgets")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("month", monthValue);

    if (data && data.length > 0) {
      setBudget(Number(data[0].amount));
    } else {
      setBudget(0);
    }
  };

  // ================= SAVE / UPDATE BUDGET =================
  const handleSaveBudget = async () => {
    if (!budgetInput) return;

    const monthValue =
      selectedMonth === "All"
        ? new Date().getMonth()
        : Number(selectedMonth);

    await supabase.from("budgets").upsert([
      {
        user_id: session.user.id,
        month: monthValue,
        amount: Number(budgetInput),
      },
    ]);

    setBudget(Number(budgetInput));
    setBudgetInput("");
  };

  // ================= FILTER EXPENSES =================
  const filteredExpenses = expenses.filter((expense) => {
    const categoryMatch =
      selectedCategory === "All" ||
      expense.category === selectedCategory;

    const monthMatch =
      selectedMonth === "All" ||
      new Date(expense.date).getMonth().toString() === selectedMonth;

    return categoryMatch && monthMatch;
  });

  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );
const handleDownloadCSV = () => {
  if (filteredExpenses.length === 0) return;

  const headers = ["Title", "Amount (₹)", "Category", "Date"];

  const rows = filteredExpenses.map((expense) => [
    expense.title,
    `₹ ${expense.amount}`,
    expense.category,
    new Date(expense.date).toLocaleDateString(),
  ]);

  const totalAmount = filteredExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const totalRow = ["", "", "TOTAL", `₹ ${totalAmount}`];

  const csvContent =
    [headers, ...rows, [], totalRow]
      .map((row) => row.join(","))
      .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();

  window.URL.revokeObjectURL(url);
};
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        padding: "40px 60px",
        color: "#f1f5f9",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "36px" }}>
          📊 Daily Expense Tracker
        </h1>
        <p style={{ opacity: 0.6 }}>{session.user.email}</p>

        <button
          onClick={async () => await supabase.auth.signOut()}
          style={{
            marginTop: "15px",
            padding: "8px 18px",
            borderRadius: "8px",
            border: "none",
            background: "#64748b",
            color: "white",
          }}
        >
            
          Logout
        </button>
        <button
  onClick={handleDownloadCSV}
  disabled={filteredExpenses.length === 0}
  style={{
    marginTop: "10px",
    marginRight: "10px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: filteredExpenses.length === 0 ? "#555" : "#3b82f6",
    color: "white",
    cursor: filteredExpenses.length === 0 ? "not-allowed" : "pointer",
  }}
>
  Download CSV
</button>
      </div>

      {/* ================= BUDGET SECTION ================= */}
      <div
        style={{
          padding: "20px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "12px",
          marginBottom: "25px",
        }}
      >
        <h3>Monthly Budget</h3>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <input
            type="number"
            placeholder="Set Budget"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
            }}
          />

          <button
            onClick={handleSaveBudget}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#3b82f6",
              color: "white",
              cursor: "pointer",
            }}
          >
            Save Budget
          </button>
        </div>

        <div style={{ marginTop: "10px" }}>
          Budget: ₹ {budget}
        </div>

        <div>
          Remaining: ₹ {budget - totalAmount}
        </div>

        {totalAmount > budget && budget > 0 && (
          <div
            style={{
              marginTop: "10px",
              color: "#ef4444",
              fontWeight: "600",
            }}
          >
            ⚠ Overspending Alert! You exceeded your budget.
          </div>
        )}
      </div>

      {/* ================= SUMMARY ================= */}
      <Summary expenses={filteredExpenses} />

      {/* ================= FORM ================= */}
      <ExpenseForm session={session} fetchExpenses={fetchExpenses} />

      {/* ================= FILTERS ================= */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "30px",
        }}
      >
        <div>
          <label>Category: </label>
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
          >
            <option value="All">All</option>
            <option value="Others">Others</option>
            <option value="Groceries">Groceries</option>
            <option value="Bills">Bills</option>
            <option value="Food">Food</option>
            <option value="Shopping">Shopping</option>
            <option value="Travel">Travel</option>
          </select>
        </div>

        <div>
          <label>Month: </label>
          <select
            value={selectedMonth}
            onChange={(e) =>
              setSelectedMonth(e.target.value)
            }
          >
            <option value="All">All</option>
            {[...Array(12).keys()].map((m) => (
              <option key={m} value={m}>
                {new Date(0, m).toLocaleString("default", {
                  month: "short",
                })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ExpenseList
        expenses={filteredExpenses}
        fetchExpenses={fetchExpenses}
      />

      <div style={{ marginTop: "40px" }}>
        <ExpenseChart expenses={filteredExpenses} />
      </div>
    </div>
  );
}

export default Dashboard;