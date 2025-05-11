import React, { createContext, useState, useContext, useEffect, useCallback } from "react";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('transactions');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse transactions from localStorage', error);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions to localStorage', error);
      setError('Failed to save transactions');
    }
  }, [transactions]);

  const addTransaction = useCallback((transaction) => {
    setLoading(true);
    setError(null);
    try {
      if (!transaction || !transaction.id) {
        throw new Error('Invalid transaction data');
      }
      setTransactions(prev => [transaction, ...prev]);
    } catch (error) {
      console.error('Failed to add transaction:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTransaction = useCallback((id) => {
    setLoading(true);
    setError(null);
    try {
      if (!id) {
        throw new Error('Invalid transaction ID');
      }
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearTransactions = useCallback(() => {
    setLoading(true);
    try {
      setTransactions([]);
    } catch (error) {
      console.error('Failed to clear transactions:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    clearTransactions,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used within a TransactionsProvider");
  }
  return context;
};

export default TransactionsContext;