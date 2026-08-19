import { apiClient } from "./client";

export const RatingApi = {
    rate: (movieId: number, value: number) => apiClient.post<void>(`movies/${movieId}/rating`, { value }),
    deleteRating: (movieId: number) => apiClient.delete(`/movies/${movieId}/rating`),
};