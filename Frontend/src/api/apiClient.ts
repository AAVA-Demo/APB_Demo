export interface ApiError {
  status: number;
  message: string;
}

async function apiClient<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const token = '';
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init && init.headers),
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(input, { ...init, headers });

  if (!response.ok) {
    const error: ApiError = {
      status: response.status,
      message: response.statusText,
    };
    throw error;
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const data = await response.json();
  return data as T;
}

export default apiClient;
