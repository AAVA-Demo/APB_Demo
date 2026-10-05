export interface ApiError {
    status: number;
    message: string;
}

async function request<T>(input: string, init?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(init && init.headers ? init.headers : {}),
    };

    const token = (window as any).authToken as string | undefined;
    if (token) {
        (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(input, { ...init, headers });

    if (!response.ok) {
        let message = response.statusText;
        try {
            const problem = await response.json();
            message = problem.title || problem.detail || message;
        } catch {
            // ignore
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
    get: request,
    post: request,
};
