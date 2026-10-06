export interface ApiError {
    status: number;
    message: string;
}

const baseUrl = "/api";

function getAuthToken(): string | null {
    return null;
}

export async function apiGet<T>(url: string): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(baseUrl + url, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
    });

    if (!response.ok) {
        const message = await response.text();
        throw { status: response.status, message } as ApiError;
    }

    return response.json() as Promise<T>;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(baseUrl + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const message = await response.text();
        throw { status: response.status, message } as ApiError;
    }

    return response.json() as Promise<T>;
}

export async function apiPatch<T>(url: string, body: unknown): Promise<T> {
    const token = getAuthToken();
    const response = await fetch(baseUrl + url, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const message = await response.text();
        throw { status: response.status, message } as ApiError;
    }

    return response.json() as Promise<T>;
}

export function createEventSource(url: string): EventSource {
    const token = getAuthToken();
    const fullUrl = baseUrl + url + (token ? `?access_token=${encodeURIComponent(token)}` : "");
    return new EventSource(fullUrl);
}
