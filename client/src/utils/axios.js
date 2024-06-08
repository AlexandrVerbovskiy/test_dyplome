import axios from "axios";
import mainConfig from "_config";

const api = axios.create({
  baseURL: mainConfig.CLIENT_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
