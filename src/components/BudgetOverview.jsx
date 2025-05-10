import React, { useState, useEffect } from 'react';
import { BarChart } from '../data/ChartComponents';
import '../Styles/BudgetOverview.css';
import { useTransactions } from '../context/TransactionsContext'; // Make sure path is correct

const BudgetOverview = () => {
  const { transactions } = useTransactions();
  const [spendingData, setSpendingData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateTransactionData = () => {
      setIsLoading(true);
      try {
        // Calculate totals
        const income = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        
        const expenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        // Group by category
        const categoryMap = {};
        transactions.forEach(t => {
          if (!categoryMap[t.category]) {
            categoryMap[t.category] = { 
              income: 0, 
              expenses: 0 
            };
          }
          if (t.type === 'income') {
            categoryMap[t.category].income += t.amount;
          } else {
            categoryMap[t.category].expenses += t.amount;
          }
        });

        const categoryData = Object.entries(categoryMap).map(([name, amounts]) => ({
          name,
          income: amounts.income,
          expenses: amounts.expenses,
          balance: amounts.income - amounts.expenses
        }));

        setSpendingData({
          totalIncome: income,
          totalExpenses: expenses,
          balance: income - expenses
        });
        setCategories(categoryData);
      } catch (error) {
        console.error('Error processing transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateTransactionData();
  }, [transactions]);

  if (isLoading) {
    return <div className="loading-indicator">Loading transaction data...</div>;
  }

  return (
    <div className="budget-report">
      <h3>Financial Overview</h3>
      <div className="budget-comparison">
        <div className="budget-cards">
          <div className="budget-card">
            <h4>Total Income</h4>
            <p>${spendingData.totalIncome.toFixed(2)}</p>
          </div>
          <div className="budget-card">
            <h4>Total Expenses</h4>
            <p>${spendingData.totalExpenses.toFixed(2)}</p>
          </div>
          <div
            className={`budget-card ${
              spendingData.balance >= 0 ? 'under' : 'over'
            }`}
          >
            <h4>Balance</h4>
            <p>
              ${Math.abs(spendingData.balance).toFixed(2)}{' '}
              {spendingData.balance >= 0 ? 'Surplus' : 'Deficit'}
            </p>
          </div>
        </div>
        <div className="budget-chart">
          <BarChart
            data={[spendingData.totalIncome, spendingData.totalExpenses]}
            labels={['Income', 'Expenses']}
          />
        </div>
      </div>
      <div className="budget-by-category">
        <h4>Category Breakdown</h4>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Income</th>
              <th>Expenses</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.name}>
                <td>{cat.name}</td>
                <td>${cat.income.toFixed(2)}</td>
                <td>${cat.expenses.toFixed(2)}</td>
                <td
                  className={
                    cat.balance >= 0 ? 'under' : 'over'
                  }
                >
                  ${cat.balance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetOverview;