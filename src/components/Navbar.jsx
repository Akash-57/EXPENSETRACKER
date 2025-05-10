import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaChartPie, FaHistory, FaWallet, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import '../Styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary py-3">
      <div className="container-fluid">
        <span className="navbar-brand fs-3 fw-bold me-5">
          Expense Tracker
        </span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item mx-2">
              <Link className="nav-link fs-5" to="/home">
                <FaHome className="me-2" size={20} />
                Home
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link fs-5" to="/add-transaction">
                <FaPlus className="me-2" size={20} />
                Add Transaction
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link fs-5" to="/transactions">
                <FaHistory className="me-2" size={20} />
                Transactions
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link fs-5" to="/dashboard">
                <FaChartPie className="me-2" size={20} />
                Dashboard
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link fs-5" to="/budgets">
                <FaWallet className="me-2" size={20} />
                Budgets
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link fs-5" to="/reports">
                <FaChartPie className="me-2" size={20} />
                Reports
              </Link>
            </li>
          </ul>
          <button 
            className="btn btn-outline-light ms-auto"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" size={18} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;