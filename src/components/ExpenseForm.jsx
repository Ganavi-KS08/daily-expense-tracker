import { useState } from "react";
import { supabase } from "../supabaseClient";

function ExpenseForm({ session, fetchExpenses }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Others");

  const handleAdd = async () => {
    if (!title || !amount) return;

    const { error } = await supabase.from("expenses").insert([
      {
        user_id: session.user.id,
        title,
        amount: Number(amount),
        category,
      },
    ]);

    if (!error) {
      fetchExpenses();
      setTitle("");
      setAmount("");
    }
  };

  return (
    <div
      style={{
        marginTop: "30px",
        display: "flex",
        flexWrap: "wrap",        // ✅ allows wrapping
        gap: "12px",
        alignItems: "center",
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "none",
          flex: "1 1 180px",     // ✅ flexible width
          minWidth: "140px",
        }}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "none",
          flex: "1 1 120px",
          minWidth: "110px",
        }}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={{
          padding: "10px 14px",
          borderRadius: "8px",
          border: "none",
          flex: "1 1 150px",
          minWidth: "130px",
        }}
      >
        <option>Others</option>
        <option>Groceries</option>
        <option>Bills</option>
        <option>Food</option>
        <option>Shopping</option>
        <option>Travel</option>
      </select>

      <button
        onClick={handleAdd}
        style={{
          padding: "10px 18px",
          borderRadius: "8px",
          border: "none",
          background: "#22c55e",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
          flex: "0 0 auto",      // ✅ prevents stretching
        }}
      >
        Add
      </button>
    </div>
  );
}

export default ExpenseForm;