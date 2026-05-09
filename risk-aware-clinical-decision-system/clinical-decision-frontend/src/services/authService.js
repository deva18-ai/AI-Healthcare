import api from "./apiConfig";

export const login = async (email, password) => {
  try {
    const { data } = await api.post("/api/auth/login", { email, password });
    return data; // { token, email, name, specialization }
  } catch (error) {
    // Enhanced error handling
    if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
      throw new Error("Cannot connect to server. Please ensure the backend is running on http://localhost:8080");
    }
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.detail || error.response.statusText;
      throw new Error(message || `Server error: ${error.response.status}`);
    }
    throw error;
  }
};

export const register = async (email, password, name, specialization) => {
  try {
    const { data } = await api.post("/api/auth/register", { email, password, name, specialization });
    return data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.detail || error.response.statusText;
      throw new Error(message || `Server error: ${error.response.status}`);
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("profile");
};

