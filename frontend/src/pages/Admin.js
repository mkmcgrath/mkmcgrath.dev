import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

function Admin() {
  const { isAuthenticated, login, logout, username, loading } = useAuth();
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleInputChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    const result = await login(loginForm.username, loginForm.password);

    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLoginForm({ username: '', password: '' });
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <span>Loading...</span>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated()) {
    return (
      <div className="admin-container">
        <div className="login-box">
          <h1 className="login-title">Admin Login</h1>
          <p className="login-subtitle">Enter your credentials to access the admin dashboard</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={loginForm.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                disabled={isLoggingIn}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginForm.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                disabled={isLoggingIn}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  return (
    <div className="admin-container">
      <div className="admin-dashboard">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="welcome-text">Welcome back, {username}!</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Manage Projects</h3>
            <p>Create, edit, and delete projects</p>
            <button className="card-action">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <h3>Manage Blog Posts</h3>
            <p>Create, edit, and delete blog posts</p>
            <button className="card-action">Coming Soon</button>
          </div>

          <div className="dashboard-card">
            <h3>Analytics</h3>
            <p>View site statistics and metrics</p>
            <button className="card-action">Coming Soon</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
