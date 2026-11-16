// src/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL
  || `${window.location.protocol}//${window.location.hostname}:5000/api`;

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Har request mein token automatically add karo
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token expire ho jaye to automatically logout
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && (localStorage.getItem("token") || sessionStorage.getItem("token"))) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default API;
