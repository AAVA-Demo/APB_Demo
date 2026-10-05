export interface ApiError {
    status: number;
    message: string;
}

async function getAuthToken(): Promise<string | null> {
    return null;
}

export async function apiGet<T>(url: string): Promise<T> {
    const token = await getAuthToken();
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (!response.ok) {
        const error: ApiError = {
            status: response.status,
            message: response.statusText,
        };
        throw error;
    }

    return (await response.json()) as T;
}

export async function apiPost<TRequest, TResponse>(url: string, body: TRequest): Promise<TResponse> {
    const token = await getAuthToken();
    const response = await fetch(url, {
        method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(body),
        });

    if (!response.ok) {
        const error: ApiError = {
            status: response.status,
            message: response.statusText,
        };
        throw error;
    }

    return (await response.json()) as TResponse;
}
