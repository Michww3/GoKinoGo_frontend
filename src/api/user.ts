import { apiClient } from "./client";

export interface UpdateUserPayload {
  name: string;
  userName: string;
  email: string;
}

export const UserApi = {
  update: (id: number, payload: UpdateUserPayload) =>
    apiClient.put<void>(`/Users/${id}`, payload).then((res) => res.data),
  remove: (id: number) => apiClient.delete<void>(`/Users/${id}`).then((res) => res.data),
};