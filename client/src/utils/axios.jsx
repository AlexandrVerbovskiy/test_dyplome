import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // додає cookies на запити
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

// налаштування для автоматичного додавання токену до заголовків на кожному запиті
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
