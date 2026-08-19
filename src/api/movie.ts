import { Genre } from "./genre";
import { apiClient } from "./client";

export interface Movie {
    id: number,
    name: string,
    price: number,
    description: string,
    releaseDate: string,
    length: string,
    posterUrl: string,
    genres: Genre[],
}

export interface MovieSummary {
    id: number;
    name: string;
    price: number;
    posterUrl: string;
    releaseDate: string;
    genres: Genre[];
    averageRating: number;
}

export interface MovieDetails {
    id: number;
    name: string;
    description: string;
    price: number;
    releaseDate: string;
    length: string;
    posterUrl: string;
    genres: Genre[];
    averageRating: number;
    ratingsCount: number;
    userRating: number | null;
}

export interface MovieCollection {
    id: number;
    name: string;
    type: string;
    isActive: boolean;
    items: MovieCollectionItem[];
}

export interface MovieCollectionItem {
    position: number;
    movie: Movie;
}

export const MovieApi = {
    getAll: () => apiClient.get<MovieSummary[]>("/movies").then(res => res.data),
    getById: (id: number) => apiClient.get<MovieDetails>(`/movies/${id}`).then(res => res.data),
    getHero: async () => {
        const response = await apiClient.get<MovieCollection>("/MovieCollections/1");
        return response.data.items.map(item => item.movie);
    },
};