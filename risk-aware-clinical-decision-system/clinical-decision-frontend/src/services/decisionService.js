import api from "./apiConfig";

export const evaluateDecision = async (patientId) => {
  const { data } = await api.post("/api/decision/evaluate", { patientId });
  return data; // DecisionResponse
};

export const getDecisionHistory = async (patientId) => {
  const { data } = await api.get(`/api/doctor/decisions/${patientId}`);
  return data;
};

