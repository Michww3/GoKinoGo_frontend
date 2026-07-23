import axios from "axios";
import { apiClient } from "./client";

export interface Genre {
    id: number;
    name: string;
}

export const GenreApi = {
    getAll: () => apiClient.get<Genre[]>("/genre").then((response) => response.data),
    getById: (id: number) => apiClient.get<Genre>(`/genre/${id}`).then((response) => response.data),
};