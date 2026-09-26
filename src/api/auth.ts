import { apiClient } from "./client";
import type { User } from "@/stores/AuthStore";

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  userName: string;
  email: string;
  password: string;
}

export const AuthApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>("/Auth/login", payload).then((res) => res.data),
  register: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>("/Auth/register", payload).then((res) => res.data),
  me: () =>
    apiClient.get<User>("Auth/me").then((res) => res.data),
  checkEmail: (email: string) =>
    apiClient.get<{ exists: boolean }>(`/Users/check-email?email=${encodeURIComponent(email)}`).then((res) => res.data),
  checkUserName: (userName: string) =>
    apiClient.get<{ exists: boolean }>(`/Users/check-username?userName=${encodeURIComponent(userName)}`).then((res) => res.data),
  resendConfirmation: () => apiClient.post<void>("/Auth/resend-confirmation").then((res) => res.data),
  confirmEmail: (token: string) =>
    apiClient.post<void>("/Auth/confirm-email", { token }).then((res) => res.data),
};