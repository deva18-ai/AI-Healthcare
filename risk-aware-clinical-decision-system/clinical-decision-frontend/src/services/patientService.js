import api from "./apiConfig";

export const addPatient = async (payload) => {
  const { data } = await api.post("/api/patient/add", payload);
  return data;
};

export const getPatient = async (id) => {
  const { data } = await api.get(`/api/patient/${id}`);
  return data;
};

