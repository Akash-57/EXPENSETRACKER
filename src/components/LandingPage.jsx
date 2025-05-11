import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/LandingPage.css'; 

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo-container">
          <h1>Expense<span>Tracker</span></h1>
        </div>
      </header>
      
      <main className="landing-main">
        <div className="hero-content">
          <h2>Take Control of Your Finances</h2>
          <p className="hero-subtitle">Smart spending leads to wealth building</p>
          
          <div className="animated-card">
            <div className="card-content">
              <p className="quotation">
                "Track every penny, master your finances—empower your goals with precision and clarity."
              </p>
            </div>
          </div>
          
          <div className="cta-container">
            <button 
              className="btn btn-primary" 
              onClick={() => navigate("/login")}
            >
              Get Started
              <span className="btn-icon">→</span>
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
          </div>
        </div>
        
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <h3>Visual Analytics</h3>
            <p>Beautiful charts to understand your spending patterns</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔔</div>
            <h3>Smart Alerts</h3>
            <p>Get notified about unusual spending</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <h3>Multi-Device</h3>
            <p>Access from anywhere, anytime</p>
          </div>
        </div>
      </main>
      
      <footer className="landing-footer">
        <p>© 2025 ExpenseTracker. All rights reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;