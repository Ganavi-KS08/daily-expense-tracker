import { useState } from "react";
import { supabase } from "../supabaseClient";

function ExpenseList({ expenses = [], fetchExpenses }) {
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedCategory, setEditedCategory] = useState("Others");

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchExpenses();
    }
  };

  const startEditing = (expense) => {
    setEditingId(expense.id);
    setEditedTitle(expense.title);
    setEditedAmount(expense.amount);
    setEditedCategory(expense.category);
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("expenses")
      .update({
        title: editedTitle,
        amount: Number(editedAmount),
        category: editedCategory,
      })
      .eq("id", editingId);

    if (!error) {
      setEditingId(null);
      fetchExpenses();
    }
  };

  if (expenses.length === 0) {
    return (
      <div style={{ marginTop: "25px", fontSize: "20px" }}>
        No expenses added yet.
      </div>
    );
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h3 style={{ fontSize: "26px", marginBottom: "15px" }}>
        Expense List
      </h3>

      {expenses.map((expense) => (
        <div
          key={expense.id}
          style={{
            padding: "16px",
            margin: "12px 0",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "12px",
          }}
        >
          {editingId === expense.id ? (
            <>
              <input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                style={{ marginRight: "10px", padding: "6px" }}
              />

              <input
                type="number"
                value={editedAmount}
                onChange={(e) => setEditedAmount(e.target.value)}
                style={{ marginRight: "10px", padding: "6px" }}
              />

              <select
                value={editedCategory}
                onChange={(e) => setEditedCategory(e.target.value)}
                style={{ marginRight: "10px", padding: "6px" }}
              >
                <option>Others</option>
                <option>Groceries</option>
                <option>Bills</option>
                <option>Food</option>
                <option>Shopping</option>
                <option>Travel</option>
              </select>

              <button
                onClick={handleUpdate}
                style={{
                  background: "#22c55e",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  marginRight: "8px",
                }}
              >
                Save
              </button>

              <button
                onClick={() => setEditingId(null)}
                style={{
                  background: "#64748b",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "6px",
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontSize: "20px", fontWeight: "600" }}>
                  {expense.title}
                </div>
                <div style={{ opacity: 0.7 }}>
                  ₹ {expense.amount} • {expense.category}
                </div>
              </div>

              <div>
                <button
                  onClick={() => startEditing(expense)}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    marginRight: "8px",
                  }}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(expense.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;