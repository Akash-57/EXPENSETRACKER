export const defaultTransactions = [
  {
    id: 1,
    description: "Weekly grocery shopping",
    amount: 125.75,  
    category: "Food",
    type: "expense",
    date: "2023-05-10T00:00:00Z"  
  },
  {
    id: 2,
    description: "Monthly bus pass",
    amount: 65.00,  
    category: "Transport",
    type: "expense",
    date: "2023-05-01T00:00:00Z"  
  },
  {
    id: 3,
    description: "Electricity bill",
    amount: 500, 
    category: "Utilities",
    type: "expense",
    date: "2023-05-05T00:00:00Z"  
  },
  {
    id: 4,
    description: "Movie night",
    amount: 32.40, 
    category: "Entertainment",
    type: "expense",
    date: "2023-05-09T00:00:00Z" 
  },
  
  {
    id: 5,
    description: "May salary",
    amount: 50000.00,  
    category: "Salary",
    type: "income",
    date: "2023-05-01T00:00:00Z"
  },
  {
    id: 6,
    description: "Freelance project",
    amount: 5000.00,  
    category: "Freelance",
    type: "income",
    date: "2023-05-03T12:00:00Z"
  },
  {
    id: 7,
    description: "Birthday gift",
    amount: 1000.00,  
    category: "Gift",
    type: "income",
    date: "2023-05-09T18:00:00Z"
  }
];
export const getCurrentMonthYear = () => {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    monthName: now.toLocaleString('default', { month: 'long' })
  };
};
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};