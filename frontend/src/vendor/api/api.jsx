import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
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