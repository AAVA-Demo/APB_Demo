export interface ApiError {
  status: number;
  message: string;
}

const baseUrl = "/";

function getAuthToken(): string | null {
  return null;
}

export async function apiGet<T>(url: string): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(baseUrl + url, { headers });
  if (!response.ok) {
    const message = await safeReadError(response);
    throw { status: response.status, message } as ApiError;
  }
  return (await response.json()) as T;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(baseUrl + url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await safeReadError(response);
    throw { status: response.status, message } as ApiError;
  }
  return (await response.json()) as T;
}

async function safeReadError(response: Response): Promise<string> {
  try {
    const text = await response.text();
    return text || response.statusText;
  } catch {
    return response.statusText;
  }
}
