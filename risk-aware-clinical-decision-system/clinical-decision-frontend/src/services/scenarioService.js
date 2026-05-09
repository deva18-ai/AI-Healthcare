import api from "./apiConfig";

export const simulateScenario = async (payload) => {
  const { data } = await api.post("/api/scenario/simulate", payload);
  return data;
};

