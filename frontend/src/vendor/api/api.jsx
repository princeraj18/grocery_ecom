import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// ADD TOKEN AUTOMATICALLY
// ==============================

api.interceptors.request.use(
  (config) => {

    // Prefer vendor token when available, fall back to regular user token
    const token =
      localStorage.getItem("vendorToken") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

export default api;