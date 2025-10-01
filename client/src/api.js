import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5555", 
  withCredentials: true,
});

// Add the JWT on every request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;


