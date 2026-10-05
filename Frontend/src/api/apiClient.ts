export interface ApiError {
    status: number;
    message: string;
}

export async function apiClient<T>(input: string, init?: RequestInit): Promise<T> {
    const token = localStorage.getItem("authToken");
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(init && init.headers ? init.headers : {}),
    };

    if (token) {
        (headers as any)["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(input, { ...init, headers });

    if (!response.ok) {
        const text = await response.text();
        const error: ApiError = {
            status: response.status,
            message: text || response.statusText,
        };
        throw error;
    }

    if (response.status === 204) {
        return {} as T;
    }

    return (await response.json()) as T;
}
