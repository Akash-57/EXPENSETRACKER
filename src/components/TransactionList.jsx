import { useTransactions } from "../context/TransactionsContext";
import '../Styles/TransactionList.css';

const TransactionList = () => {
  const { transactions, deleteTransaction, loading } = useTransactions();

  // Calculate totals
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      acc.balance = acc.income - acc.expenses;
      return acc;
    },
    { income: 0, expenses: 0, balance: 0 }
  );

  if (loading && transactions.length === 0) {
    return (
      <div className="transaction-list component-container">
        <h2>Recent Transactions</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-list component-container">
      <h2>Recent Transactions</h2>
      
      {/* Summary Section */}
      <div className="transaction-summary">
        <div className="summary-item">
          <span className="summary-label">Income:</span>
          <span className="summary-value income">+${totals.income.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Expenses:</span>
          <span className="summary-value expense">-${totals.expenses.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Balance:</span>
          <span className={`summary-value ${totals.balance >= 0 ? 'income' : 'expense'}`}>
            ${totals.balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <p className="no-transactions">No transactions yet. Add one to get started!</p>
      ) : (
        <ul className="transactions-container">
          {[...transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((transaction) => (
              <li key={transaction.id} className={`transaction-item ${transaction.type}`}>
                <div className="transaction-main">
                  <div className="transaction-info">
                    <span className="category-badge">{transaction.category}</span>
                    <span className="description">{transaction.description}</span>
                  </div>
                  <div className="transaction-meta">
                    <span className="date">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="amount">
                      {transaction.type === 'expense' ? '-' : '+'}
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteTransaction(transaction.id)}
                  className="delete-btn"
                  disabled={loading}
                >
                  &times;
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;