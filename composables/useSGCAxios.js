import axios from "axios";

export default function (config, fulfilled = undefined, rejected = undefined) {
  const sgcAxios = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add JWT token interceptor for SGC requests
  sgcAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('sgcAuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptors (with optional custom handlers)
  sgcAxios.interceptors.response.use(fulfilled, rejected);
  
  return sgcAxios;
}