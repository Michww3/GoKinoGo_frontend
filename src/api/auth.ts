import { apiClient } from "./client";

export interface User {
  id: number;
  name: string;
  userName: string;
  email: string;
  role: string;
}

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
};