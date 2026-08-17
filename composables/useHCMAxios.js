import axios from "axios";
import { sessionExpiryRedirect } from "~/utils/sessionExpiry";

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

  // Session-expiry guard: a 401 means the token is missing, expired, or
  // rejected — clear it and send the user to login instead of surfacing a
  // raw error toast. Permission errors are 403 and pass through untouched.
  hcmAxios.interceptors.response.use(undefined, error => {
    const target = sessionExpiryRedirect(error, "/hcm/login", window.location.pathname);
    if (target) {
      localStorage.removeItem("hcmAuthToken");
      window.location.assign(target);
    }
    return Promise.reject(error);
  });

  // Add response interceptors (with optional custom handlers)
  hcmAxios.interceptors.response.use(fulfilled, rejected);

  return hcmAxios;
}
