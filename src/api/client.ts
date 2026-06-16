/**
 * Lightweight, OpenAPI-ready API client.
 *
 * For now, every service call is fulfilled by the in-memory mock layer in
 * `src/mocks/`. When the Django REST Framework backend is ready, replace
 * the body of `request()` with a real `fetch()` against the generated
 * OpenAPI client — the typed service contracts in `src/services/` will not
 * have to change.
 */

export interface ApiRequestOptions<TBody = unknown> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: TBody;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Mimic network latency in the mock service layer. */
export const mockDelay = (ms = 280) =>
  new Promise<void>((resolve) => {
    if (typeof window === "undefined") return resolve();
    setTimeout(resolve, ms);
  });

type Handler = (opts: ApiRequestOptions) => Promise<unknown>;
const handlers = new Map<string, Handler>();

export function registerMockHandler(
  key: `${"GET" | "POST" | "PUT" | "PATCH" | "DELETE"} ${string}`,
  handler: Handler,
) {
  handlers.set(key, handler);
}

export async function request<T>(opts: ApiRequestOptions): Promise<T> {
  const method = opts.method ?? "GET";
  const handler = handlers.get(`${method} ${opts.path}`);
  if (handler) {
    await mockDelay();
    return (await handler(opts)) as T;
  }
  throw new ApiError(`No handler registered for ${method} ${opts.path}`, 501);
}

export const apiClient = {
  get: <T,>(path: string, query?: ApiRequestOptions["query"]) =>
    request<T>({ method: "GET", path, query }),
  post: <T, B = unknown>(path: string, body?: B) =>
    request<T>({ method: "POST", path, body }),
  put: <T, B = unknown>(path: string, body?: B) =>
    request<T>({ method: "PUT", path, body }),
  patch: <T, B = unknown>(path: string, body?: B) =>
    request<T>({ method: "PATCH", path, body }),
  delete: <T,>(path: string) => request<T>({ method: "DELETE", path }),
};