import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addPatient } from "../../services/patientService";
import { evaluateDecision } from "../../services/decisionService";
import { AppContext } from "../../App";
import { 
  User, 
  Activity, 
  ClipboardList, 
  AlertCircle,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import Loader from "../common/Loader";
import "./Patient.css";

const initialForm = {
  age: "",
  gender: "",
  symptoms: "",
  vitalSigns: {
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    oxygenLevel: "",
  },
  medicalHistory: {
    chronicConditions: "",
    allergies: "",
    medications: "",
  },
};

const PatientForm = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const { setLatestPatient, setLatestDecision } = React.useContext(AppContext);

  const onChange = (path, value) => {
    const [key, sub] = path.split(".");
    if (sub) {
      setForm((prev) => ({
        ...prev,
        [key]: { ...prev[key], [sub]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);
    try {
      const payload = {
        age: Number(form.age),
        gender: form.gender,
        symptoms: form.symptoms,
        vitalSigns: {
          bloodPressure: form.vitalSigns.bloodPressure,
          heartRate: Number(form.vitalSigns.heartRate),
          temperature: Number(form.vitalSigns.temperature),
          oxygenLevel: Number(form.vitalSigns.oxygenLevel),
        },
        medicalHistory: {
          chronicConditions: form.medicalHistory.chronicConditions,
          allergies: form.medicalHistory.allergies,
          medications: form.medicalHistory.medications,
        },
      };

      const patient = await addPatient(payload);
      setLatestPatient(patient);

      const decision = await evaluateDecision(patient.id);
      setLatestDecision(decision);

      navigate("/decisions", { state: { decision, patient } });
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(Object.values(err.response.data.errors));
      } else {
        setErrors([err.response?.data?.message || "An unexpected error occurred. Please try again."]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-root">
      <header className="form-header">
        <h1 className="form-title">Patient Intake</h1>
        <p className="form-subtitle">Enter clinical data for automated risk evaluation.</p>
      </header>

      <form onSubmit={handleSubmit} className="patient-card">
        {errors && (
          <div className="error-banner">
            {errors.map((err, i) => (
              <div key={i} className="error-item">
                <AlertCircle size={16} />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        {/* Basic Info */}
        <div className="section-box">
          <div className="section-label">
            <User size={18} />
            <span>Basic Information</span>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Age</label>
              <input
                type="number"
                placeholder="Years"
                required
                value={form.age}
                onChange={(e) => onChange("age", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Gender</label>
              <select
                required
                value={form.gender}
                onChange={(e) => onChange("gender", e.target.value)}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-field full-width">
              <label>Current Symptoms</label>
              <textarea
                rows={3}
                placeholder="Describe presenting symptoms..."
                required
                value={form.symptoms}
                onChange={(e) => onChange("symptoms", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Vital Signs */}
        <div className="section-box">
          <div className="section-label">
            <Activity size={18} />
            <span>Vital Signs</span>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>Blood Pressure (mmHg)</label>
              <input
                required
                value={form.vitalSigns.bloodPressure}
                onChange={(e) => onChange("vitalSigns.bloodPressure", e.target.value)}
                placeholder="e.g. 120/80"
              />
            </div>
            <div className="form-field">
              <label>Heart Rate (BPM)</label>
              <input
                type="number"
                required
                value={form.vitalSigns.heartRate}
                onChange={(e) => onChange("vitalSigns.heartRate", e.target.value)}
                placeholder="60-100"
              />
            </div>
            <div className="form-field">
              <label>Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                required
                value={form.vitalSigns.temperature}
                onChange={(e) => onChange("vitalSigns.temperature", e.target.value)}
                placeholder="36.5"
              />
            </div>
            <div className="form-field">
              <label>SpO₂ Oxygen (%)</label>
              <input
                type="number"
                required
                value={form.vitalSigns.oxygenLevel}
                onChange={(e) => onChange("vitalSigns.oxygenLevel", e.target.value)}
                placeholder="95-100"
              />
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="section-box">
          <div className="section-label">
            <ClipboardList size={18} />
            <span>Medical History</span>
          </div>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>Chronic Conditions</label>
              <textarea
                rows={2}
                placeholder="e.g. Diabetes, Hypertension..."
                value={form.medicalHistory.chronicConditions}
                onChange={(e) => onChange("medicalHistory.chronicConditions", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Known Allergies</label>
              <input
                placeholder="e.g. Penicillin"
                value={form.medicalHistory.allergies}
                onChange={(e) => onChange("medicalHistory.allergies", e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Current Medications</label>
              <input
                placeholder="e.g. Metformin"
                value={form.medicalHistory.medications}
                onChange={(e) => onChange("medicalHistory.medications", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn secondary" onClick={() => setForm(initialForm)}>
            <RotateCcw size={18} />
            Reset Form
          </button>
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? "Analyzing..." : "Evaluate Clinical Risk"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </div>

        {loading && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Loader label="Processing patient data and generating risk profile..." />
          </div>
        )}
      </form>
    </div>
  );
};

export default PatientForm;
