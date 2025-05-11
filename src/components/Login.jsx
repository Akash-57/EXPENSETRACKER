import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const generateCaptcha = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
    for (let i = 0; i < 4; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    setCaptchaText(captcha);
    setUserCaptcha("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields");
      setIsSubmitting(false);
      return;
    }

    // First check credentials before showing CAPTCHA
    if (password && !showCaptcha) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(user => user.username === username);
      
      if (!user) {
        setError("Username not found");
        setIsSubmitting(false);
        return;
      }

      if (user.password !== password) {
        setError("Incorrect password");
        setIsSubmitting(false);
        return;
      }

      setShowCaptcha(true);
      setIsSubmitting(false);
      return;
    }

    if (showCaptcha && userCaptcha !== captchaText) {
      setError("Invalid CAPTCHA. Please try again.");
      generateCaptcha();
      setIsSubmitting(false);
      return;
    }

    // If we get here, credentials and CAPTCHA are correct
    setTimeout(() => {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("currentUser", JSON.stringify({ username }));
      navigate("/home");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {showCaptcha && (
            <div className="mb-3 captcha-container">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label">Enter CAPTCHA</label>
                <button 
                  type="button" 
                  className="btn btn-sm btn-link p-0 text-decoration-none"
                  onClick={generateCaptcha}
                >
                  <i className="bi bi-arrow-clockwise"></i> Refresh
                </button>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="captcha-display">
                  {captchaText.split('').map((char, index) => (
                    <span 
                      key={index} 
                      style={{
                        display: 'inline-block',
                        transform: `rotate(${Math.random() * 30 - 15}deg)`,
                        color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                        fontSize: `${20 + Math.random() * 10}px`
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="form-control flex-grow-1"
                  placeholder="Type the CAPTCHA"
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {showCaptcha ? "Verifying..." : "Logging in..."}
              </>
            ) : (
              showCaptcha ? "Verify & Login" : "Continue"
            )}
          </button>
        </form>
        <div className="mt-3 text-center">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <p>
            <Link to="/">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;