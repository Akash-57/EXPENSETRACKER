import { Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  Title
} from 'chart.js';
import { useTransactions } from '../context/TransactionsContext';
import '../Styles/Dashboard.css';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const ExpenseChart = () => {
  const { transactions } = useTransactions();

  // Filter expenses for current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyExpenses = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return t.type === 'expense' && 
           transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });

  // Define categories and colors
  const categories = [
    'Food', 'Transport', 'Housing', 
    'Entertainment', 'Utilities', 'Other'
  ];
  
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', 
    '#4BC0C0', '#9966FF', '#FF9F40'
  ];

  // Calculate amounts per category
  const categoryData = categories.map(category => ({
    category,
    amount: monthlyExpenses
      .filter(t => t.category === category)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  }));

  // Filter out categories with zero amount
  const filteredData = categoryData.filter(item => item.amount > 0);

  // Prepare chart data
  const chartData = {
    labels: filteredData.map(item => item.category),
    datasets: [{
      data: filteredData.map(item => item.amount),
      backgroundColor: colors.slice(0, filteredData.length),
      borderColor: '#fff',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Monthly Expenses by Category',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="chart-section">
      <div className="chart-container">
        {filteredData.length > 0 ? (
          <Pie data={chartData} options={chartOptions} />
        ) : (
          <div className="no-data-message">
            <p>No expense data available for the current month</p>
            <div className="category-legend">
              {categories.map((category, index) => (
                <div key={category} className="legend-item">
                  <span 
                    className="color-box" 
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span>{category}: $0.00</span>
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