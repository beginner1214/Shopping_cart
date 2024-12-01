import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import "../Style/Registerpage.css"

const Registerpage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Added password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await createUserWithEmailAndPassword(getAuth(), email, password);
      navigate("/login");
    } catch (err) {
      // More specific error handling
      if (err.code === 'auth/weak-password') {
        setError("Password is too weak. Please use a stronger password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Email is already registered. Try logging in.");
      } else {
        setError("Failed to register. Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-content">
          <h2>Create Account</h2>
          <p className="subtitle">Join our community today</p>
          
          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="register-button">
              Create Account
            </button>

            <div className="login-link">
              Already have an account? 
              <Link to="/login"> Log in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registerpage;