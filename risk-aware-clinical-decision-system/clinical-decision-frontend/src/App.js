import React, { createContext, useEffect, useMemo, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./components/common/NavBar";
import Footer from "./components/common/Footer";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import DoctorDashboard from "./components/dashboard/DoctorDashboard";
import PatientForm from "./components/patient/PatientForm";
import PatientDetails from "./components/patient/PatientDetails";
import DecisionResult from "./components/decisions/DecisionResult";
import ScenarioSimulator from "./components/scenarios/ScenarioSimulator";
import "./App.css";

export const AppContext = createContext(null);

const getStoredAuth = () => {
  const token = localStorage.getItem("token");
  const profile = localStorage.getItem("profile");
  return {
    token: token || "",
    profile: profile ? JSON.parse(profile) : null,
  };
};

const ProtectedShell = () => {
  const { token } = React.useContext(AppContext);
  if (!token) return <Navigate to="/login" replace />;
  return (
    <div className="shell">
      <NavBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        <main className="page">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

const App = () => {
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(null);
  const [latestPatient, setLatestPatient] = useState(null);
  const [latestDecision, setLatestDecision] = useState(null);

  useEffect(() => {
    const stored = getStoredAuth();
    setToken(stored.token);
    setProfile(stored.profile);
  }, []);

  const ctxValue = useMemo(
    () => ({
      token,
      profile,
      setAuth: (newToken, newProfile) => {
        setToken(newToken);
        setProfile(newProfile);
        if (newToken) localStorage.setItem("token", newToken);
        else localStorage.removeItem("token");
        if (newProfile) localStorage.setItem("profile", JSON.stringify(newProfile));
        else localStorage.removeItem("profile");
      },
      latestPatient,
      setLatestPatient,
      latestDecision,
      setLatestDecision,
    }),
    [token, profile, latestPatient, latestDecision]
  );

  return (
    <AppContext.Provider value={ctxValue}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedShell />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DoctorDashboard />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id" element={<PatientDetails />} />
          <Route path="/decisions" element={<DecisionResult />} />
          <Route path="/scenario" element={<ScenarioSimulator />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppContext.Provider>
  );
};

export default App;

