function Summary({ expenses }) {
  const total =
    expenses?.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    ) || 0;

  return (
    <div
      style={{
        marginTop: "20px",
        padding: "20px",
        background: "rgba(255,255,255,0.1)",
        borderRadius: "12px",
      }}
    >
      <h2 style={{ fontSize: "28px" }}>
        Total Expenses: ₹ {total}
      </h2>
    </div>
  );
}

export default Summary;