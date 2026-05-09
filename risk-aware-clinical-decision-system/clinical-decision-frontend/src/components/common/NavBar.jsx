import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import { logout } from "../../services/authService";
import { 
  LayoutDashboard, 
  UserPlus, 
  BrainCircuit, 
  FlaskConical, 
  LogOut,
  Stethoscope
} from "lucide-react";
import "./common.css";

const NavBar = () => {
  const { profile, setAuth } = React.useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAuth("", null);
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-icon">
          <Stethoscope size={24} color="white" />
        </div>
        <div className="brand-text">
          <div className="brand-title">Clinical AI</div>
          <div className="brand-subtitle">Intelligence</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/patients/new" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <UserPlus size={20} />
          <span>Add Patient</span>
        </NavLink>
        <NavLink to="/decisions" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <BrainCircuit size={20} />
          <span>Decisions</span>
        </NavLink>
        <NavLink to="/scenario" className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}>
          <FlaskConical size={20} />
          <span>Scenarios</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        {profile && (
          <div className="sidebar-user">
            <div className="user-avatar">
              {profile.name?.charAt(0) || "D"}
            </div>
            <div className="user-info">
              <div className="user-name">{profile.name || "Doctor"}</div>
              <div className="user-role">{profile.specialization || "MD"}</div>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default NavBar;
