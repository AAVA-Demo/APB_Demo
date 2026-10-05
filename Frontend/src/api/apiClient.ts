export interface ApiError {
    status: number;
    message: string;
}

export async function apiGet<T>(url: string, token?: string): Promise<T> {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw { status: response.status, message: text || response.statusText } as ApiError;
    }

    return (await response.json()) as T;
}

export async function apiPost<TRequest, TResponse>(url: string, body: TRequest, token?: string): Promise<TResponse> {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const text = await response.text();
        throw { status: response.status, message: text || response.statusText } as ApiError;
    }

    return (await response.json()) as TResponse;
}
