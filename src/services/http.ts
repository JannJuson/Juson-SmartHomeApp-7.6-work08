import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config';

export class ApiError extends Error {
    status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

let authToken: string | null = null;

/** Call after login; every later request sends `Authorization: Bearer <token>`. */
export function setAuthToken(token: string | null) {
    authToken = token;
}

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
};

function messageFrom(data: unknown): string | undefined {
    if (typeof data !== 'object' || data === null) return undefined;
    const record = data as Record<string, unknown>;
    if (typeof record.message === 'string') return record.message;
    if (typeof record.error === 'string') return record.error;
    return undefined;
}

export async function request<T>(
    path: string,
    { method = 'GET', body }: RequestOptions = {}
): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (body !== undefined) headers['Content-Type'] = 'application/json';
        if (authToken) headers.Authorization = `Bearer ${authToken}`;

        const response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
            signal: controller.signal,
        });

        const text = await response.text();
        let data: unknown = null;

        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                if (response.ok) {
                    throw new ApiError(
                        'The server sent a response the app could not read.',
                        response.status
                    );
                }
            }
        }

        if (!response.ok) {
            throw new ApiError(
                messageFrom(data) ?? `Request failed (${response.status}).`,
                response.status
            );
        }

        return data as T;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        if (error instanceof Error && error.name === 'AbortError') {
            throw new ApiError('The server took too long to respond.');
        }
        throw new ApiError(
            'Cannot reach the server. Check your connection and the API address.'
        );
    } finally {
        clearTimeout(timer);
    }
}
