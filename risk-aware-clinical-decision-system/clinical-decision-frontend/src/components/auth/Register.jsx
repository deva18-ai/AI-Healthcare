import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import { AppContext } from "../../App";
import { ShieldAlert, ArrowLeft, Mail, Lock, User, Activity, AlertCircle } from "lucide-react";
import "./Auth.css";

const Register = () => {
  const { token, setAuth } = React.useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (token) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(email, password, name, specialization);
      setAuth(data.token, {
        email: data.email,
        name: data.name,
        specialization: data.specialization,
      });
      navigate("/dashboard");
    } catch (err) {
      const errorMsg = err.message || "Unable to register. Please try again.";
      setError(errorMsg);
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon-container">
            <ShieldAlert size={32} />
          </div>
          <h1 className="auth-title">Clinician Registration</h1>
          <p className="auth-subtitle">Create your clinical account</p>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Jane Doe"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Specialization</label>
            <div className="input-wrapper">
              <Activity size={18} className="input-icon" />
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Cardiology"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.org"
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
            {loading ? "Registering..." : "Create Account"}
          </button>

          <div className="auth-actions" style={{ justifyContent: "center", marginTop: "16px" }}>
            <Link to="/login" className="auth-link">
              <ArrowLeft size={16} style={{ verticalAlign: "middle", marginRight: "4px" }} />
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
