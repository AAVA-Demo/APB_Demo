import axios, { AxiosInstance } from "axios";

let apiClient: AxiosInstance | null = null;

function createClient(): AxiosInstance {
  const instance = axios.create({ baseURL: "/api" });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
}

export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    apiClient = createClient();
  }
  return apiClient;
}
