import axios from 'axios';

// When running in production on cloud, use the live Render backend URL.
// When running locally with `npm run dev`, fall back to `/api` proxy.
const backendUrl = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://job-application-api-ov3f.onrender.com/api' : '/api');

const API = axios.create({
  baseURL: backendUrl,
});

// Automatically attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
