import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import '../styles/SignupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Don't navigate immediately - let user check email
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

  if (success) {
    return (
      <div className="signup-container">
        <div className="signup-box">
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
          <div className="right-panel">
            <div className="signup-form-container">
              <h2 className="signup-title">Check Your Email!</h2>
              <p className="signup-subtitle">
                We've sent you a confirmation link at <strong>{formData.email}</strong>
              </p>
              <p className="signup-subtitle">
                Please check your email and click the link to activate your account.
              </p>
              <div className="signup-link">
                <p>Already confirmed? <Link to="/login">Sign in</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
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

        {/* Right Panel - Signup Form */}
        <div className="right-panel">
          <div className="signup-form-container">
            <h2 className="signup-title">Create Account</h2>
            <p className="signup-subtitle">Join Sunflow Inventory today</p>
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First name"
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last name"
                    disabled={loading}
                  />
                </div>
              </div>

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
                  placeholder="Create a password"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>

              <div className="form-options">
                <label className="terms-agreement">
                  <input type="checkbox" required />
                  <span>I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a></span>
                </label>
              </div>

              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="signup-link">
                <p>Already have an account? <Link to="/login">Sign in</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
