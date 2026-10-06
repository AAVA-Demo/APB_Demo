import axios, { AxiosInstance, AxiosError } from "axios";

let client: AxiosInstance | null = null;

function createClient(): AxiosInstance {
    const instance = axios.create({
        baseURL: "/",
        timeout: 10000,
    });

    instance.interceptors.request.use((config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers = config.headers ?? {};
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    });

    instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    return instance;
}

export function getApiClient(): AxiosInstance {
    if (!client) {
        client = createClient();
    }
    return client;
}
