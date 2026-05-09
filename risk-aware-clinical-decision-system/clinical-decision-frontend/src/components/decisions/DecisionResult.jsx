import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AppContext } from "../../App";
import { evaluateDecision } from "../../services/decisionService";
import { Search, BrainCircuit, AlertCircle } from "lucide-react";
import Loader from "../common/Loader";
import RiskCard from "./RiskCard";
import "./Decision.css";

const DecisionResult = () => {
  const location = useLocation();
  const { latestDecision, setLatestDecision, latestPatient } = React.useContext(AppContext);
  const [patientId, setPatientId] = useState(latestPatient?.id || "");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const decision = location.state?.decision || latestDecision;

  const runEvaluation = async () => {
    if (!patientId) {
      setError("Patient ID is required");
      return;
    }
    setWorking(true);
    setError("");
    try {
      const res = await evaluateDecision(Number(patientId));
      setLatestDecision(res);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to evaluate. Ensure patient exists and backend is running.");
    } finally {
      setWorking(false);
    }
  };

  useEffect(() => {
    if (location.state?.patient?.id && !patientId) {
      setPatientId(location.state.patient.id);
    }
    if (location.state?.decision) {
      setLatestDecision(location.state.decision);
    }
  }, [location.state, patientId, setLatestDecision]);

  return (
    <div className="decision-root">
      <header className="decision-header">
        <h1 className="welcome-text">Decision Recommendations</h1>
        <p className="subtitle-text">Clinical intelligence prioritized by risk severity tiers.</p>
      </header>

      <div className="search-card">
        <div className="search-input-group">
          <label>Identify Patient</label>
          <input
            type="number"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter Patient ID (e.g. 1)"
          />
        </div>
        <button className="btn primary" type="button" onClick={runEvaluation} disabled={working}>
          {working ? "Processing..." : "Run AI Evaluation"}
          <BrainCircuit size={18} />
        </button>
      </div>

      {error && (
        <div className="error-banner" style={{ marginBottom: 32 }}>
          <div className="error-item">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        </div>
      )}

      {!decision && !working && (
        <div className="dashboard-card" style={{ textAlign: 'center', padding: '60px' }}>
          <Search size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <p className="text-muted">No clinical decisions found. Please evaluate a patient to see recommendations.</p>
        </div>
      )}

      {working && (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Loader label="Synthesizing risk factors and generating recommendations..." />
        </div>
      )}

      {decision && !working && (
        <div className="decision-container">
          <RiskCard decision={decision} />
          
          {decision.reasoningFactors && decision.reasoningFactors.length > 0 && (
            <div className="reasoning-card">
              <div className="section-title" style={{ fontSize: 16 }}>
                <BrainCircuit size={18} />
                Clinical Reasoning Factors
              </div>
              <ul className="reasoning-list">
                {decision.reasoningFactors.map((factor, i) => (
                  <li key={i}>{factor}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DecisionResult;
