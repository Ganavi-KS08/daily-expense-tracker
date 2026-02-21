function ExpenseItem({ item, deleteExpense }) {
  return (
    <div className="expense-item">
      <span>
        <strong>{item.title}</strong> 
        {" "}({item.category}) — ₹ {item.amount}
      </span>

      <button
        className="delete-btn"
        onClick={() => deleteExpense(item.id)}
      >
        Delete
      </button>
    </div>
  )
}

export default ExpenseItem