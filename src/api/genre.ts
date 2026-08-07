import { apiClient } from "./client";

export interface Genre {
    id: number;
    name: string;
}

export const GenreApi = {
    getAll: () => apiClient.get<Genre[]>("/genres").then((response) => response.data),
    getById: (id: number) => apiClient.get<Genre>(`/genres/${id}`).then((response) => response.data),
};