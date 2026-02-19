import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {'Content-Type': 'application/json'},
  withCredentials: true,
});

export default api;
