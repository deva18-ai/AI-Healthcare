import React, { useState } from "react";
import { AppContext } from "../../App";
import { simulateScenario } from "../../services/scenarioService";
import Loader from "../common/Loader";
import RiskCard from "../decisions/RiskCard";
import { BrainCircuit } from "lucide-react";
import "./Scenario.css";

const ScenarioSimulator = () => {
  const { latestPatient, setLatestDecision, latestDecision } = React.useContext(AppContext);
  const [patientId, setPatientId] = useState(latestPatient?.id || "");
  const [scenarioType, setScenarioType] = useState("VITALS_WORSEN");
  const [modifiedVitals, setModifiedVitals] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    oxygenLevel: "",
  });
  const [result, setResult] = useState(latestDecision || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!patientId) {
      setError("Patient ID is required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const payload = {
        patientId: Number(patientId),
        scenarioType,
        modifiedVitals:
          modifiedVitals.bloodPressure ||
          modifiedVitals.heartRate ||
          modifiedVitals.temperature ||
          modifiedVitals.oxygenLevel
            ? {
                bloodPressure: modifiedVitals.bloodPressure || undefined,
                heartRate: modifiedVitals.heartRate ? Number(modifiedVitals.heartRate) : undefined,
                temperature: modifiedVitals.temperature ? Number(modifiedVitals.temperature) : undefined,
                oxygenLevel: modifiedVitals.oxygenLevel ? Number(modifiedVitals.oxygenLevel) : undefined,
              }
            : null,
      };
      const data = await simulateScenario(payload);
      setResult(data);
      setLatestDecision(data);
    } catch (err) {
      setError(err.response?.data?.message || "Simulation failed. Ensure patient exists.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-title">
        <BrainCircuit size={20} />
        Scenario Simulation
      </div>

      <div className="scenario-card">
        <div className="two-col">
          <div className="form-field">
            <label>Patient ID</label>
            <input value={patientId} onChange={(e) => setPatientId(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Scenario</label>
            <select value={scenarioType} onChange={(e) => setScenarioType(e.target.value)}>
              <option value="VITALS_WORSEN">Worsening vitals</option>
              <option value="SYMPTOMS_INCREASE">Increased symptoms</option>
              <option value="MISSING_HISTORY">Missing history</option>
            </select>
          </div>
        </div>

        <div className="section-title" style={{ fontSize: 16, marginBottom: 8 }}>
          Optional: Override vitals
        </div>
        <div className="two-col">
          <div className="form-field">
            <label>Blood Pressure</label>
            <input
              value={modifiedVitals.bloodPressure}
              onChange={(e) => setModifiedVitals((p) => ({ ...p, bloodPressure: e.target.value }))}
              placeholder="e.g., 150/95"
            />
          </div>
          <div className="form-field">
            <label>Heart Rate</label>
            <input
              value={modifiedVitals.heartRate}
              onChange={(e) => setModifiedVitals((p) => ({ ...p, heartRate: e.target.value }))}
              placeholder="e.g., 110"
            />
          </div>
          <div className="form-field">
            <label>Temperature (C)</label>
            <input
              value={modifiedVitals.temperature}
              onChange={(e) => setModifiedVitals((p) => ({ ...p, temperature: e.target.value }))}
              placeholder="e.g., 38.4"
            />
          </div>
          <div className="form-field">
            <label>SpO2 (%)</label>
            <input
              value={modifiedVitals.oxygenLevel}
              onChange={(e) => setModifiedVitals((p) => ({ ...p, oxygenLevel: e.target.value }))}
              placeholder="e.g., 90"
            />
          </div>
        </div>

        <div className="actions">
          <button className="btn secondary" type="button" onClick={() => setModifiedVitals({ bloodPressure: "", heartRate: "", temperature: "", oxygenLevel: "" })}>
            Clear Overrides
          </button>
          <button className="btn" type="button" onClick={submit} disabled={loading}>
            {loading ? "Simulating..." : "Simulate Scenario"}
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}
      </div>

      {loading && <Loader label="Running simulation..." />}

      {result && !loading && (
        <div className="scenario-result" style={{ marginTop: 16 }}>
          <div className="section-title">Simulation Output</div>
          <div className="decision-container">
            <RiskCard decision={result} />
            {result.reasoningFactors?.length > 0 && (
              <div className="reasoning-card">
                <div className="section-title" style={{ fontSize: 16 }}>
                  <BrainCircuit size={18} />
                  Clinical Reasoning Factors
                </div>
                <ul className="reasoning-list">
                  {result.reasoningFactors.map((factor, i) => (
                    <li key={i}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator;

