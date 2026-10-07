import type { AuthResponse, Diagnosis, DiagnosisInput, Part, PartInput, User } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api';
const TOKEN_KEY = 'diagbay_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown };

async function request<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    // network error, or the render instance is still waking up
    throw new ApiError('Cannot reach the server. It may be starting up, please try again in a moment.', 0);
  }

  if (res.status === 204) return undefined as T;
  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      typeof data === 'object' && data !== null && 'message' in data && typeof data.message === 'string'
        ? data.message
        : `Request failed (${res.status})`;
    // expired token -> AuthContext logs out
    if (res.status === 401 && token) window.dispatchEvent(new Event('auth:expired'));
    throw new ApiError(message, res.status);
  }
  return data as T;
}

const toQuery = (params: Record<string, string | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => value && search.set(key, value));
  const query = search.toString();
  return query ? `?${query}` : '';
};

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body }),
  login: (body: { email: string; password: string }) => request<AuthResponse>('/auth/login', { method: 'POST', body }),
  me: () => request<{ user: User }>('/auth/me'),

  // Parts
  getParts: (params: { q?: string; category?: string } = {}) => request<Part[]>(`/parts${toQuery(params)}`),
  getCategories: () => request<string[]>('/parts/categories'),
  getPart: (id: string) => request<Part>(`/parts/${id}`),
  createPart: (body: PartInput) => request<Part>('/parts', { method: 'POST', body }),
  updatePart: (id: string, body: Partial<PartInput>) => request<Part>(`/parts/${id}`, { method: 'PUT', body }),
  deletePart: (id: string) => request<void>(`/parts/${id}`, { method: 'DELETE' }),

  // Diagnoses
  createDiagnosis: (body: DiagnosisInput) => request<Diagnosis>('/diagnoses', { method: 'POST', body }),
  getDiagnoses: () => request<Diagnosis[]>('/diagnoses'),
  getDiagnosis: (id: string) => request<Diagnosis>(`/diagnoses/${id}`),
  deleteDiagnosis: (id: string) => request<void>(`/diagnoses/${id}`, { method: 'DELETE' })
};

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong';
