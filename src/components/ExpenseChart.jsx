import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function ExpenseChart({ expenses }) {
  const categoryData = {};

  expenses.forEach((item) => {
    if (!categoryData[item.category]) {
      categoryData[item.category] = 0;
    }
    categoryData[item.category] += item.amount;
  });

  const chartData = Object.keys(categoryData)
    .map((key) => ({
      name: key,
      value: categoryData[key],
    }))
    .filter((item) => item.value > 0); // remove 0% categories

  const COLORS = [
    "#6366F1", // Indigo
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EF4444", // Soft Red
    "#3B82F6", // Blue
    "#8B5CF6", // Violet
  ];

  if (chartData.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "40px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <PieChart width={500} height={380}>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={90}
          outerRadius={140}
          paddingAngle={4}
          labelLine={false}
          label={({ percent }) =>
            percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
          }
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip
  formatter={(value, name) => [`₹ ${value}`, name]}
  contentStyle={{
    backgroundColor: "#111827",
    borderRadius: "12px",
    border: "none",
  }}
  itemStyle={{
    color: "#ffffff",
    fontWeight: 500,
  }}
  labelStyle={{
    color: "#9CA3AF",
  }}
/>

        <Legend
          verticalAlign="bottom"
          iconType="circle"
          wrapperStyle={{
            marginTop: 25,
            fontWeight: 500,
          }}
        />
      </PieChart>
    </div>
  );
}

export default ExpenseChart;