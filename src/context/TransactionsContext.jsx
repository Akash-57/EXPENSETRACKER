import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import axios from "axios";

const TransactionsContext = createContext();

export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from backend
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/transactions");
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(); // Load transactions when component mounts
  }, [fetchTransactions]);

  // Add transaction to backend
  const addTransaction = useCallback(async (transaction) => {
    try {
      await axios.post("http://localhost:8080/transactions", transaction);
      fetchTransactions(); // Refresh transactions list after adding
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }, [fetchTransactions]);

  // Get transactions by type (Fixing missing function)
  const getTransactionsByType = useCallback((type) => {
    return transactions.filter((t) => t.type === type);
  }, [transactions]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        addTransaction,
        getTransactionsByType, // Now available
      }}
    >
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