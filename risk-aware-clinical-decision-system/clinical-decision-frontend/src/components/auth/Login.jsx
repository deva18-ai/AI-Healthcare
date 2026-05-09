import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { AppContext } from "../../App";
import { Activity, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import "./Auth.css";

const Login = () => {
  const { token, setAuth } = React.useContext(AppContext);
  const [email, setEmail] = useState("doctor@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (token) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      setAuth(data.token, {
        email: data.email,
        name: data.name,
        specialization: data.specialization,
      });
      navigate("/dashboard");
    } catch (err) {
      // Show detailed error message
      const errorMsg = err.message || err.response?.data?.message || err.response?.data?.detail || "Unable to login. Check credentials or server.";
      setError(errorMsg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-container">
            <Activity size={32} />
          </div>
          <h1 className="auth-title">Clinical Portal</h1>
          <p className="auth-subtitle">Sign in to access patient records and risk assessments</p>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@example.com"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button className="btn-login" type="submit" disabled={loading}>
            {loading ? "Authenticating..." : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>

          <div className="auth-actions">
            <span className="auth-note">Authorized personnel only</span>
            <Link to="/register" className="auth-link">
              Need access?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
