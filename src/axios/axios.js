import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // 🔥 bien utilisé ici
  withCredentials: true,
});

export default API;