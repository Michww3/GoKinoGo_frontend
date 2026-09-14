import { apiClient } from "./client";
import { MovieSummary } from "./movie";

export interface UpdateUserPayload {
  name?: string;
  userName?: string;
  email?: string;
}

export interface UpdateUserPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserRating {
  id: number;
  value: number;
  movie: MovieSummary;
}

export const UserApi = {
  update: (id: number, payload: UpdateUserPayload) =>
    apiClient.put<void>(`/Users/${id}`, payload).then((res) => res.data),
    changePassword: (id: number, payload: UpdateUserPasswordPayload) =>
    apiClient.put<void>(`/Users/${id}/password`, payload).then((res) => res.data),
  remove: (id: number) => apiClient.delete<void>(`/Users/${id}`).then((res) => res.data),
  getRatings: () => apiClient.get<UserRating[]>(`/Users/ratings`).then((res) => res.data),
};