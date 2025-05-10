import { useState } from "react";
import { useTransactions } from "../context/TransactionsContext";
import axios from "axios";
import "../Styles/AddTransaction.css";

const AddTransaction = () => {
  const { fetchTransactions, addTransaction } = useTransactions();
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Food",
    type: "expense",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const expenseCategories = [
    "Food", "Transport", "Housing", "Entertainment", "Utilities",
    "Healthcare", "Education"
  ];

  const incomeCategories = [
    "Salary", "Bonus", "Freelance", "Investment", "Gift", "Rental", "Other Income"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "type" && { category: value === "income" ? "Salary" : "Food" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description || !formData.amount) {
      setMessage("Please fill all fields before submitting.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date().toISOString(),
      });

      fetchTransactions(); // Refresh transactions list
      setFormData({ description: "", amount: "", category: "Food", type: "expense" });
      setMessage("Transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      setMessage("Failed to add transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction">
      <div className="component-container">
        <h2>Add New Transaction</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Transaction Type</label>
            <div className="radio-group">
              {["expense", "income"].map((type) => (
                <label key={type} className={`radio-label ${formData.type === type ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                    className="radio-input"
                  />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="category-select"
              required
            >
              {(formData.type === "income" ? incomeCategories : expenseCategories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter transaction details"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <div className="amount-input-container">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading || !formData.description || !formData.amount}>
            {loading ? "Processing..." : "Add Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;