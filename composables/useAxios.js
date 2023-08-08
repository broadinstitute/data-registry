import axios from 'axios'

export default function(config, fulfilled = undefined, rejected = undefined){
  const configuredAxios = axios.create({
    baseURL: config.public['apiBaseUrl'],
    headers: {
      "access-token": config.public['apiSecret'],
      "Content-Type": "application/json",
    },
    withCredentials: true,
  })
  configuredAxios.interceptors.response.use(fulfilled, rejected)
  return configuredAxios;
}
