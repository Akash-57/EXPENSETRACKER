import React, { useState, useEffect } from 'react';
import { PieChart, LineChart } from '../data/ChartComponents';
import DateRangePicker from '../data/DateRangePicker';
import { exportToCSV } from '../data/exportUtils'; 
import { useTransactions } from '../context/TransactionsContext';
import { defaultTransactions } from '../data/defaultTransactions';
import '../Styles/ReportsPage.css';

const ReportsPage = () => {
  const { transactions } = useTransactions();
  const [activeReport, setActiveReport] = useState('summary');
  const getInitialDateRange = () => {
    const allTransactions = [...defaultTransactions, ...transactions];
    if (allTransactions.length === 0) {
      const today = new Date();
      return {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today
      };
    }
    
    const transactionDates = allTransactions.map(t => new Date(t.date).getTime());
    const minDate = new Date(Math.min(...transactionDates));
    const maxDate = new Date(Math.max(...transactionDates));
    return {
      start: minDate,
      end: maxDate
    };
  };

  const [dateRange, setDateRange] = useState(getInitialDateRange());
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState({
    summary: {
      totalExpenses: 0,
      totalIncome: 0,
      netAmount: 0,
      averageDaily: 0,
      largestExpense: { amount: 0, description: '', category: '', date: '' },
      largestIncome: { amount: 0, description: '', category: '', date: '' },
      categories: []
    },
    trends: [],
    transactionCount: 0,
    filteredTransactions: []
  });

  const getCategoryColor = (category) => {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', 
      '#8AC24A', '#607D8B', '#E91E63', '#9C27B0'
    ];
    const index = Math.abs(hashCode(category)) % colors.length;
    return colors[index];
  };

  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  useEffect(() => {
    const calculateReportData = () => {
      setIsLoading(true);
      
      const allTransactions = [...defaultTransactions, ...transactions];
      
      const filteredTransactions = allTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
      });

      const expenses = filteredTransactions.filter(t => t.type === 'expense');
      const income = filteredTransactions.filter(t => t.type === 'income');
      
      const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
      const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
      const netAmount = totalIncome - totalExpenses;
      
      const daysInRange = Math.ceil((dateRange.end - dateRange.start) / (1000 * 60 * 60 * 24)) || 1;
      const averageDaily = totalExpenses / daysInRange;
      
      const largestExpense = expenses.length > 0 
        ? expenses.reduce((max, t) => t.amount > max.amount ? t : max, expenses[0])
        : { amount: 0, description: '', category: '', date: '' };

      const largestIncome = income.length > 0 
        ? income.reduce((max, t) => t.amount > max.amount ? t : max, income[0])
        : { amount: 0, description: '', category: '', date: '' };

      const categoryMap = {};
      expenses.forEach(transaction => {
        if (!categoryMap[transaction.category]) {
          categoryMap[transaction.category] = 0;
        }
        categoryMap[transaction.category] += transaction.amount;
      });

      const totalForCategories = totalExpenses || 1;
      const categories = Object.keys(categoryMap).map(category => {
        const amount = categoryMap[category];
        return {
          name: category,
          amount,
          percentage: (amount / totalForCategories * 100),
          color: getCategoryColor(category)
        };
      });
      const trendsData = [];
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
      
      while (currentDate <= endDate) {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const monthName = currentDate.toLocaleString('default', { month: 'short' });
        
        const monthExpenses = expenses
          .filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === month && tDate.getFullYear() === year;
          })
          .reduce((sum, t) => sum + t.amount, 0);
          
        const monthIncome = income
          .filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === month && tDate.getFullYear() === year;
          })
          .reduce((sum, t) => sum + t.amount, 0);
          
        trendsData.push({
          month: `${monthName} ${year}`,
          expense: monthExpenses,
          income: monthIncome,
          net: monthIncome - monthExpenses
        });
        
        currentDate = new Date(year, month + 1, 1);
      }

      setReportData({
        summary: {
          totalExpenses,
          totalIncome,
          netAmount,
          averageDaily,
          largestExpense: {
            amount: largestExpense.amount,
            description: largestExpense.description,
            category: largestExpense.category,
            date: largestExpense.date ? new Date(largestExpense.date).toLocaleDateString() : ''
          },
          largestIncome: {
            amount: largestIncome.amount,
            description: largestIncome.description,
            category: largestIncome.category,
            date: largestIncome.date ? new Date(largestIncome.date).toLocaleDateString() : ''
          },
          categories
        },
        trends: trendsData,
        transactionCount: filteredTransactions.length,
        filteredTransactions
      });
      
      setIsLoading(false);
    };

    calculateReportData();
  }, [transactions, dateRange]);

  const handleExport = () => {
    const exportData = {
      reportType: activeReport,
      dateRange: {
        start: dateRange.start.toISOString().split('T')[0],
        end: dateRange.end.toISOString().split('T')[0]
      },
      ...reportData
    };

    const fileName = `financial-report-${new Date().toISOString().slice(0, 10)}`;

    try {
      exportToCSV(exportData, fileName);
    } catch (error) {
      console.error('Export failed:', error);
      alert(`Export failed: ${error.message}`);
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Financial Reports</h1>
        <div className="report-controls">
          <DateRangePicker range={dateRange} onChange={setDateRange} />
          <div className="transaction-count">
            Showing {reportData.transactionCount} transactions
          </div>
          <div className="export-buttons">
            <button onClick={handleExport}>
              <i className="export-icon">📄</i> Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="report-navigation">
        <button
          className={activeReport === 'summary' ? 'active' : ''}
          onClick={() => setActiveReport('summary')}
        >
          Summary
        </button>
        <button
          className={activeReport === 'trends' ? 'active' : ''}
          onClick={() => setActiveReport('trends')}
        >
          Trends
        </button>
        <button
          className={activeReport === 'transactions' ? 'active' : ''}
          onClick={() => setActiveReport('transactions')}
        >
          Transactions
        </button>
      </div>

      {isLoading ? (
        <div className="loading-indicator">Loading report data...</div>
      ) : (
        <div className="report-content">
          {activeReport === 'summary' && (
            <div className="summary-report">
              <div className="net-worth-indicator">
                <h3>Net Amount</h3>
                <div className={`net-worth-value ${
                  reportData.summary.netAmount >= 0 ? 'net-worth-positive' : 'net-worth-negative'
                }`}>
                  ${Math.abs(reportData.summary.netAmount).toFixed(2)}
                  <span className="net-worth-label">
                    {reportData.summary.netAmount >= 0 ? ' (Profit)' : ' (Loss)'}
                  </span>
                </div>
                <p className="subtext">
                  {dateRange.start.toLocaleDateString()} to {dateRange.end.toLocaleDateString()}
                </p>
              </div>

              <div className="summary-cards">
                <div className="summary-card income">
                  <h3>Total Income</h3>
                  <p className="amount">${reportData.summary.totalIncome.toFixed(2)}</p>
                  <p className="subtext">for selected period</p>
                </div>
                <div className="summary-card expense">
                  <h3>Total Expenses</h3>
                  <p className="amount">${reportData.summary.totalExpenses.toFixed(2)}</p>
                  <p className="subtext">for selected period</p>
                </div>
                <div className="summary-card average">
                  <h3>Average Daily</h3>
                  <p className="amount">${reportData.summary.averageDaily.toFixed(2)}</p>
                  <p className="subtext">expenses per day</p>
                </div>
              </div>

              <div className="categories-section">
                <h3>Expense Categories</h3>
                {reportData.summary.categories?.length > 0 ? (
                  <div className="categories-chart">
                    <PieChart data={reportData.summary.categories} />
                    <div className="categories-list">
                      {reportData.summary.categories.map(category => (
                        <div key={category.name} className="category-item">
                          <span 
                            className="category-color" 
                            style={{ backgroundColor: category.color }}
                          ></span>
                          <span className="category-name">{category.name}</span>
                          <span className="category-amount">
                            ${category.amount.toFixed(2)} ({category.percentage.toFixed(1)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="no-data-message">No expense categories available</p>
                )}
              </div>

              <div className="largest-transactions">
                <div className="largest-transaction">
                  <h3>Largest Expense</h3>
                  {reportData.summary.largestExpense.amount > 0 ? (
                    <>
                      <p className="amount">${reportData.summary.largestExpense.amount.toFixed(2)}</p>
                      <p className="description">{reportData.summary.largestExpense.description}</p>
                      <p className="details">
                        {reportData.summary.largestExpense.category} • {reportData.summary.largestExpense.date}
                      </p>
                    </>
                  ) : (
                    <p className="no-data">No expense data</p>
                  )}
                </div>
                <div className="largest-transaction">
                  <h3>Largest Income</h3>
                  {reportData.summary.largestIncome.amount > 0 ? (
                    <>
                      <p className="amount">${reportData.summary.largestIncome.amount.toFixed(2)}</p>
                      <p className="description">{reportData.summary.largestIncome.description}</p>
                      <p className="details">
                        {reportData.summary.largestIncome.category} • {reportData.summary.largestIncome.date}
                      </p>
                    </>
                  ) : (
                    <p className="no-data">No income data</p>
                  )}
                </div>
              </div>

              <div className="transactions-list">
                <h3>Recent Transactions</h3>
                {reportData.filteredTransactions.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.filteredTransactions
                        .slice(0, 5)
                        .map((transaction, index) => (
                          <tr key={index}>
                            <td>{new Date(transaction.date).toLocaleDateString()}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.category}</td>
                            <td className={transaction.type}>{transaction.type}</td>
                            <td className={transaction.type}>
                              ${transaction.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data-message">No transactions available</p>
                )}
              </div>
            </div>
          )}

          {activeReport === 'trends' && (
            <div className="trends-report">
              <h3>Monthly Financial Trends</h3>
              <div className="trends-chart">
                {reportData.trends.length > 0 ? (
                  <LineChart
                    data={[
                      reportData.trends.map(t => t.income),
                      reportData.trends.map(t => t.expense),
                      reportData.trends.map(t => t.net)
                    ]}
                    labels={reportData.trends.map(t => t.month)}
                    datasets={[
                      { label: 'Income', borderColor: '#2ecc71' },
                      { label: 'Expense', borderColor: '#e74c3c' },
                      { label: 'Net', borderColor: '#3498db' }
                    ]}
                  />
                ) : (
                  <p className="no-data-message">No trend data available</p>
                )}
              </div>
              <div className="trends-table">
                <table>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Income</th>
                      <th>Expense</th>
                      <th>Net</th>
                      <th>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.trends.map((trend, index) => {
                      const change = index > 0
                        ? ((trend.net - reportData.trends[index - 1].net) /
                          Math.abs(reportData.trends[index - 1].net || 1)) * 100
                        : 0;
                      return (
                        <tr key={trend.month}>
                          <td>{trend.month}</td>
                          <td>${trend.income.toFixed(2)}</td>
                          <td>${trend.expense.toFixed(2)}</td>
                          <td className={trend.net >= 0 ? 'positive' : 'negative'}>
                            ${trend.net.toFixed(2)}
                          </td>
                          <td className={change >= 0 ? 'positive' : 'negative'}>
                            {index > 0 ? `${change.toFixed(1)}%` : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeReport === 'transactions' && (
            <div className="transactions-report">
              <h3>All Transactions</h3>
              <div className="transactions-table-container">
                {reportData.filteredTransactions.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.filteredTransactions.map((transaction, index) => (
                        <tr key={index}>
                          <td>{new Date(transaction.date).toLocaleDateString()}</td>
                          <td>{transaction.description}</td>
                          <td>{transaction.category}</td>
                          <td className={transaction.type}>{transaction.type}</td>
                          <td className={transaction.type}>
                            ${transaction.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data-message">No transactions available for selected period</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;