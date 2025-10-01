import axios from "axios";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: "http://localhost:5555",
  withCredentials: true,
});

// ✅ Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Catch 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — clearing token and redirecting to login");

      // Remove invalid token
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      // Redirect to login
      window.location.href = "/users/login";
    }
    return Promise.reject(error);
  }
);

export default api;