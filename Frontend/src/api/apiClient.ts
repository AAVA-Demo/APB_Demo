export interface ApiError {
    status: number;
    message: string;
}

async function apiRequest<T>(input: string, init?: RequestInit): Promise<T> {
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
        let message = "Request failed";
        try {
            const problem = await response.json();
            if (problem && problem.title) {
                message = problem.title;
            }
        } catch {
            // ignore parse errors
        }
        const error: ApiError = { status: response.status, message };
        throw error;
    }

    if (response.status === 204) {
        return undefined as unknown as T;
    }

    return (await response.json()) as T;
}

export const apiClient = {
    get: <T>(url: string) => apiRequest<T>(url, { method: "GET" }),
    post: <T>(url: string, body?: unknown) =>
        apiRequest<T>(url, {
            method: "POST",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
    patch: <T>(url: string, body?: unknown) =>
        apiRequest<T>(url, {
            method: "PATCH",
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }),
};
