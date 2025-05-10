import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="home-title">Take Control of Your Finances</h1>
        <p className="home-subtitle">Smart budgeting made simple</p>
        
        <div className="animated-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Expense Tracking</h3>
          <p>Monitor every dollar with intuitive visual reports</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Budget Planning</h3>
          <p>Set limits and get alerts before you overspend</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🏦</div>
          <h3>Multi-Account</h3>
          <p>Manage all your accounts in one place</p>
        </div>
      </div>

      <div className="cta-section">
        <p className="inspiration-quote">
          "Financial freedom begins with awareness.<br />
          Track smart, spend wiser, live better."
        </p>
        <Link to="/dashboard" className="cta-button">
          Get Started Now →
        </Link>
      </div>
    </div>
  );
};

export default Home;