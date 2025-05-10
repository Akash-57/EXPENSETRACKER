
import { useTransactions } from '../context/TransactionsContext.jsx';
import '../Styles/TransactionList.css';

const TransactionList = () => {
  const { transactions, deleteTransaction } = useTransactions();

  return (
    <div className="transaction-list component-container">
      <h2>Recent Transactions</h2>
      {transactions.length === 0 ? (
        <p className="no-transactions">No transactions yet. Add one to get started!</p>
      ) : (
        <ul className="transactions-container">
          {transactions.map((transaction) => (
            <li key={transaction.id} className={`transaction ${transaction.type}`}>
              <div className="transaction-main">
                <div className="transaction-info">
                  <span className="category-badge">{transaction.category}</span>
                  <span className="description">{transaction.description}</span>
                </div>
                <div className="transaction-meta">
                  <span className="date">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="amount">
                    {transaction.type === 'expense' ? '-' : '+'}
                    ${transaction.amount.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="transaction-actions">
                <button 
                  onClick={() => deleteTransaction(transaction.id)}
                  className="delete-btn"
                  aria-label="Delete transaction"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;