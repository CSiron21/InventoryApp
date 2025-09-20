import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Navigation will be handled by the auth state change in App.jsx
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Left Panel - Branding */}
        <div className="left-panel">
          <div className="branding-content">
            <div className="sun-icon">
              <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                <circle cx="30" cy="30" r="25" stroke="#000" strokeWidth="2" fill="none"/>
                <circle cx="30" cy="30" r="8" fill="#000"/>
                <line x1="30" y1="5" x2="30" y2="15" stroke="#000" strokeWidth="2"/>
                <line x1="30" y1="45" x2="30" y2="55" stroke="#000" strokeWidth="2"/>
                <line x1="5" y1="30" x2="15" y2="30" stroke="#000" strokeWidth="2"/>
                <line x1="45" y1="30" x2="55" y2="30" stroke="#000" strokeWidth="2"/>
                <line x1="12.5" y1="12.5" x2="19.5" y2="19.5" stroke="#000" strokeWidth="2"/>
                <line x1="40.5" y1="40.5" x2="47.5" y2="47.5" stroke="#000" strokeWidth="2"/>
                <line x1="47.5" y1="12.5" x2="40.5" y2="19.5" stroke="#000" strokeWidth="2"/>
                <line x1="19.5" y1="40.5" x2="12.5" y2="47.5" stroke="#000" strokeWidth="2"/>
              </svg>
            </div>
            <div className="brand-text">
              <h1>Sunflow</h1>
              <h2>Inventory</h2>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="right-panel">
          <div className="login-form-container">
            <h2 className="login-title">Welcome Back!</h2>
            <p className="login-subtitle">Please sign in to your account</p>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>


              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              <div className="signup-link">
                <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
