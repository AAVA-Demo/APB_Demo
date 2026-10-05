export interface ApiError {
    status: number;
    message: string;
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(init && init.headers ? init.headers : {}),
    };

    const token = localStorage.getItem("authToken");
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(input, { ...init, headers });

    if (!response.ok) {
        const problem = await response.json().catch(() => undefined);
        const error: ApiError = {
            status: response.status,
            message: problem?.detail || problem?.title || "Request failed",
        };
        throw error;
    }

    if (response.status === 204) {
        return undefined as unknown as T;
    }

    return (await response.json()) as T;
}

export const apiClient = {
    get: <T>(url: string) => request<T>(url),
    post: <TRequest, TResponse>(url: string, body: TRequest) =>
        request<TResponse>(url, {
            method: "POST",
            body: JSON.stringify(body),
        }),
};
