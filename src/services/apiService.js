import axios from 'axios';
const API_BASE_URL = 'http://localhost:2808/api'; 
export const getTransactions = () => axios.get(`${API_BASE_URL}/transactions`);
export const addTransaction = (transactionData) => axios.post(`${API_BASE_URL}/transactions`, transactionData);
export const signup = (userData) => axios.post(`${API_BASE_URL}/auth/signup`, userData);
export const login = (credentials) => axios.post(`${API_BASE_URL}/auth/login`, credentials);
export const getBudgets = () => axios.get(`${API_BASE_URL}/budgets`);