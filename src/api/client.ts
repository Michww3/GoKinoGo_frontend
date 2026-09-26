import axios from "axios";

interface ApiErrorOptions {
  fallback?: string;
  statusMessages?: Record<number, string>;
}

export function getApiErrorMessage(error: unknown, options: ApiErrorOptions | string = {}): string {
  const opts = typeof options === "string" ? { fallback: options } : options;
  const fallback = opts.fallback ?? "Что-то пошло не так. Попробуйте ещё раз.";

  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  if (!error.response) {
    return "Нет соединения с сервером. Проверьте интернет и попробуйте снова.";
  }

  const status = error.response.status;
  if (opts.statusMessages?.[status]) {
    return opts.statusMessages[status];
  }

  const data = error.response.data as {
    message?: string; // ApiException-middleware
    errors?: Record<string, string[]>; // model validation ASP.NET
    title?: string;
  };

  if (data?.errors) {
    const firstError = Object.values(data.errors)[0]?.[0];
    if (firstError) return firstError;
  }

  return data?.message || data?.title || fallback;
}

export const apiClient = axios.create({
    baseURL: "/api",
});

const TOKEN_KEY = "token";

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

apiClient.interceptors.request.use((config) => {
    const token = tokenStorage.get();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});