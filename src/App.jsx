import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import LandingPage from "./components/LandingPage";
import TransactionsPage from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import ReportsPage from './components/ReportsPage';
import BudgetOverview from './components/BudgetOverview';
import Signup from './components/Signup';
import Login from './components/Login';
import { TransactionsProvider } from './context/TransactionsContext.jsx'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const isLoggedIn = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

const AuthenticatedLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Expense Tracker</p>
        </div>
      </footer>
    </div>
  );
};

const PublicLayout = () => {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} Expense Tracker</p>
        </div>
      </footer>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <TransactionsProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/budgets" element={<BudgetOverview />} />
          </Route>
          <Route
            path="*"
            element={
              isLoggedIn() ? (
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </TransactionsProvider>
    </Router>
  );
}

export default App;