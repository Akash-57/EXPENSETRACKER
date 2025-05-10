import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTransactions } from "../context/TransactionsContext.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = () => {
  const { transactions, getTransactionsByType } = useTransactions();

  // Handle missing function gracefully
  if (!getTransactionsByType || typeof getTransactionsByType !== "function") {
    console.error("Error: getTransactionsByType is not defined in TransactionsContext.");
    return <div>Error loading expense data.</div>;
  }

  const expenses = getTransactionsByType("expense") || [];

  console.log("Expense transactions:", expenses);

  const categoryConfig = [
    { name: "Food", color: "#FF6384" },
    { name: "Transport", color: "#36A2EB" },
    { name: "Housing", color: "#FFCE56" },
    { name: "Entertainment", color: "#4BC0C0" },
    { name: "Utilities", color: "#9966FF" },
    { name: "Other", color: "#FF9F40" },
  ];

  const expensesData = categoryConfig.map((config) =>
    expenses
      .filter((t) => t.category === config.name)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  );

  const hasExpenses = expensesData.some((amount) => amount > 0);
  const totalExpenses = expensesData.reduce((sum, amount) => sum + amount, 0);

  const chartData = {
    labels: categoryConfig.map((c) => c.name),
    datasets: [
      {
        data: expensesData,
        backgroundColor: categoryConfig.map((c) => c.color),
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.raw || 0;
            const percentage = totalExpenses > 0 ? Math.round((value / totalExpenses) * 100) : 0;
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="expense-chart-container">
      <h3>Expense Distribution</h3>
      <div className="chart-content">
        {hasExpenses ? (
          <div className="chart-wrapper">
            <Pie data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="no-expenses">
            <p>No expenses recorded yet</p>
            <div className="category-list">
              {categoryConfig.map((category) => (
                <div key={category.name} className="category-item">
                  <span className="category-color" style={{ backgroundColor: category.color }} />
                  {category.name}: $0.00
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;