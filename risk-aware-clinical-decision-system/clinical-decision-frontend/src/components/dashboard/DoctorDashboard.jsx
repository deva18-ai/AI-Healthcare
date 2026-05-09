import React from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import RiskGauge from "./RiskGauge";
import VitalsChart from "./VitalsChart";
import { 
  Activity, 
  Users, 
  AlertTriangle, 
  ChevronRight,
  PlusCircle,
  FileText,
  Settings,
  BrainCircuit
} from "lucide-react";
import "./Dashboard.css";

const DoctorDashboard = () => {
  const { profile, latestDecision, latestPatient } = React.useContext(AppContext);
  const navigate = useNavigate();

  const riskLevel = latestDecision?.riskLevel || "LOW";
  const highRisk = riskLevel === "HIGH";
  const mediumRisk = riskLevel === "MEDIUM";
  const riskScore = latestDecision?.riskScore ?? 0.15;

  // Mock historical data for charts
  const hrData = [
    { time: "08:00", value: 72 },
    { time: "10:00", value: 75 },
    { time: "12:00", value: 82 },
    { time: "14:00", value: 78 },
    { time: "16:00", value: 85 },
  ];

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <div>
          <h1 className="welcome-text">Clinical Overview</h1>
          <p className="subtitle-text">Welcome back, {profile?.name || "Doctor"}. Here is your patient status update.</p>
        </div>
        <button className="btn primary" onClick={() => navigate("/patients/new")}>
          <PlusCircle size={20} />
          New Evaluation
        </button>
      </header>

      <div className="dashboard-content">
        {/* Risk Assessment Card */}
        <section className="risk-assessment-section">
          <div className="dashboard-card risk-main-card">
            <div className="card-header">
              <h3 className="card-title">Live Risk Analysis</h3>
              <Activity size={20} className="text-primary" />
            </div>
            <div className="risk-card-body">
              <RiskGauge score={riskScore} />
              <div className="risk-details">
                <div className="risk-status">
                  <span className={`risk-indicator ${highRisk ? "high" : mediumRisk ? "medium" : "stable"}`}></span>
                  <span className="risk-label">
                    {highRisk ? "CRITICAL ACTION REQUIRED" : mediumRisk ? "ENHANCED MONITORING" : "STABLE PATIENT STATUS"}
                  </span>
                </div>
                <p className="risk-description">
                  {latestDecision?.explanation || "No active evaluation yet. Start a patient intake to generate a risk profile."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon users">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{latestPatient ? 1 : 0}</div>
              <div className="stat-label">Active Patients</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon alerts">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{highRisk ? 1 : 0}</div>
              <div className="stat-label">Critical Alerts</div>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon reports">
              <FileText size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{latestDecision ? 1 : 0}</div>
              <div className="stat-label">Evaluations</div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <section className="analytics-section">
          <div className="dashboard-card chart-card">
            <VitalsChart data={hrData} title="Heart Rate Trend (BPM)" />
          </div>
          
          <div className="dashboard-card navigation-links">
            <h3 className="card-title">Quick Actions</h3>
            <div className="action-list">
              <div className="action-item" onClick={() => navigate("/decisions")}>
                <div className="action-icon">
                  <BrainCircuit size={18} />
                </div>
                <div className="action-text">
                  <span>View Full Decisions</span>
                  <small>Detailed risk breakdown</small>
                </div>
                <ChevronRight size={18} className="chevron" />
              </div>
              <div className="action-item" onClick={() => navigate("/scenario")}>
                <div className="action-icon">
                  <Settings size={18} />
                </div>
                <div className="action-text">
                  <span>Scenario Lab</span>
                  <small>Run simulations</small>
                </div>
                <ChevronRight size={18} className="chevron" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
