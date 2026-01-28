import axios from "axios";

export default function useCALRAxios(config, fulfilled = undefined, rejected = undefined) {
  const calrAxios = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add JWT token interceptor for CALR requests
  calrAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('calrAuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptors (with optional custom handlers)
  calrAxios.interceptors.response.use(fulfilled, rejected);

  return calrAxios;
}
