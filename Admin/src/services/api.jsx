import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach admin token for admin requests
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore
  }

  return config;
});

export default api;