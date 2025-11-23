import axios from "axios";
import { getToken } from "@/lib/token";

export const baseURL =
  import.meta.env.VITE_RUN_MODE === "development"
    ? import.meta.env.VITE_BACKEND_DEV_API_URL
    : import.meta.env.VITE_BACKEND_API_URL;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

api.defaults.withCredentials = true;

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = token ? `Bearer ${token}` : "";
  }

  return config;
});
export default api;
