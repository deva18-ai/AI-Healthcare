import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatient } from "../../services/patientService";
import { getDecisionHistory } from "../../services/decisionService";
import Loader from "../common/Loader";
import "./Patient.css";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getPatient(id);
        setPatient(p);
        const h = await getDecisionHistory(id);
        setHistory(h || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch patient.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <Loader label="Retrieving patient record..." />;
  if (error) return <div className="error-banner">{error}</div>;

  return (
    <div className="patient-card">
      <div className="section-title">
        <span role="img" aria-label="patient">🧍</span>
        Patient #{patient.id}
      </div>
      <div className="two-col">
        <div className="form-field">
          <label>Age</label>
          <div>{patient.age}</div>
        </div>
        <div className="form-field">
          <label>Gender</label>
          <div>{patient.gender}</div>
        </div>
      </div>
      <div className="form-field">
        <label>Symptoms</label>
        <div>{patient.symptoms}</div>
      </div>

      <div className="section-title" style={{ marginTop: 4 }}>
        Decision History
      </div>
      {history.length === 0 && <div className="text-muted">No decisions recorded.</div>}
      {history.map((h) => (
        <div key={h.id} className="section-box">
          <div className="history-header">
            <div className="text-muted">Recorded at: {h.createdAt?.replace("T", " ").slice(0, 19) || "—"}</div>
            <div className={`badge ${h.riskLevel.toLowerCase()}`}>
              {h.riskLevel} Risk ({Math.round(h.riskScore * 100)}%)
            </div>
          </div>
          <div className="form-field">
            <label>Action Taken</label>
            <div>{h.recommendedAction}</div>
          </div>
          <div className="form-field">
            <label>Reasoning</label>
            <div className="reasoning-text">{h.reasoningFactors || "None"}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientDetails;

