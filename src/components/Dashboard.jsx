import { useTransactions } from "../context/TransactionsContext.jsx";
import SummaryCard from "./SummaryCard";
import ExpenseChart from "./ExpenseChart";
import "../Styles/Dashboard.css";

const Dashboard = () => {
  const { transactions } = useTransactions();

  // Handle loading state
  if (!transactions) {
    return <div className="dashboard-container"><p>Loading transactions...</p></div>;
  }

  if (transactions.length === 0) {
    return <div className="dashboard-container"><p>No transactions found.</p></div>;
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const balance = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

  return (
    <div className="dashboard-container">
      <div className="summary-cards-grid">
        <SummaryCard 
          title="Total Balance" 
          value={`$${balance.toFixed(2)}`} 
          type="balance" 
          trend={balance >= 0 ? "up" : "down"}
        />
        <SummaryCard 
          title="Monthly Income" 
          value={`$${totalIncome.toFixed(2)}`} 
          type="income" 
          trend="up"
        />
        <SummaryCard 
          title="Monthly Expenses" 
          value={`$${totalExpenses.toFixed(2)}`} 
          type="expense" 
          trend="down"
        />
        <SummaryCard 
          title="Savings Rate" 
          value={`${savingsRate.toFixed(1)}%`} 
          type="savings" 
          trend={savingsRate >= 0 ? "up" : "down"}
        />
      </div>

      <div className="chart-section">
        <ExpenseChart />
      </div>
    </div>
  );
};

export default Dashboard;