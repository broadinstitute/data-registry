import axios from "axios";

export default function usePEGAxios(config, fulfilled = undefined, rejected = undefined) {
  const pegAxios = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add JWT token interceptor for PEG requests (for future auth)
  pegAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('pegAuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptors (with optional custom handlers)
  pegAxios.interceptors.response.use(fulfilled, rejected);
  
  return pegAxios;
}
