import axios from "axios";

export default function (config, fulfilled = undefined, rejected = undefined) {
  const calrAxios = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add response interceptors (with optional custom handlers)
  calrAxios.interceptors.response.use(fulfilled, rejected);

  return calrAxios;
}
