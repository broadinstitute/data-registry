import axios from "axios";
import { sessionExpiryRedirect } from "~/utils/sessionExpiry";

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

  // Session-expiry guard: a 401 means the token is missing, expired, or
  // rejected — clear it and send the user to login instead of surfacing a
  // raw error toast. Permission errors are 403 and pass through untouched.
  sgcAxios.interceptors.response.use(undefined, error => {
    const target = sessionExpiryRedirect(error, "/sgc/login", window.location.pathname);
    if (target) {
      localStorage.removeItem("sgcAuthToken");
      window.location.assign(target);
    }
    return Promise.reject(error);
  });

  // Add response interceptors (with optional custom handlers)
  sgcAxios.interceptors.response.use(fulfilled, rejected);
  
  return sgcAxios;
}