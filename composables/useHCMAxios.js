import axios from "axios";

export default function useHCMAxios(config, fulfilled = undefined, rejected = undefined) {
  const hcmAxios = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add JWT token interceptor for HCM requests
  hcmAxios.interceptors.request.use(config => {
    const token = localStorage.getItem('hcmAuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptors (with optional custom handlers)
  hcmAxios.interceptors.response.use(fulfilled, rejected);

  return hcmAxios;
}
