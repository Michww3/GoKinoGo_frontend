import axios from "axios";
import { Genre } from "./genre";
import { apiClient } from "./client";

export interface Movie {
    id: number,
    name: string,
    description: string,
    releaseDate: string,
    length: string,
    posterUrl: string,
    genres: Genre[],
}

export const MovieApi = {
    getAll: () => apiClient.get<Movie[]>("/movies").then(res => res.data),
    getById: (id: number) => apiClient.get<Movie>(`/movies/${id}`).then(res => res.data),
    getHero: () => apiClient.get<Movie[]>("/MovieCollections/1/movies").then((res) => res.data),

};