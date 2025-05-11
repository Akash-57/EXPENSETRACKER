import { useTransactions } from "../context/TransactionsContext";
import SummaryCard from "./SummaryCard";
import ExpenseChart from "./ExpenseChart";
import "../Styles/Dashboard.css";

const Dashboard = () => {
  const { transactions, loading } = useTransactions();

  // Handle loading state
  if (loading) {
    return <div className="dashboard-container"><p>Loading transactions...</p></div>;
  }

  if (!loading && (!transactions || transactions.length === 0)) {
    return <div className="dashboard-container"><p>No transactions found. Add some transactions to see data.</p></div>;
  }

  // Calculate totals for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  const totalIncome = monthlyTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalExpenses = monthlyTransactions
    .filter(t => t.type === "expense")
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