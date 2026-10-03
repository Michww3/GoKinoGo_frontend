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

export type MovieSortOption = "dateDesc" | "dateAsc" | "ratingDesc" | "recentlyAdded";

export interface MoviesQuery {
    pageNumber: number;
    pageSize: number;
    searchQuery?: string;
    genreIds?: number[];
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    minRating?: number;
    sortBy?: MovieSortOption;
}

export interface PagedResult<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

function buildMoviesParams(query: MoviesQuery): URLSearchParams {
    const params = new URLSearchParams();
    params.set("pageNumber", String(query.pageNumber));
    params.set("pageSize", String(query.pageSize));
    if (query.searchQuery) params.set("searchQuery", query.searchQuery);
    if (query.sortBy) params.set("sortBy", query.sortBy);
    if (query.minPrice != null) params.set("minPrice", String(query.minPrice));
    if (query.maxPrice != null) params.set("maxPrice", String(query.maxPrice));
    if (query.minYear != null) params.set("minYear", String(query.minYear));
    if (query.maxYear != null) params.set("maxYear", String(query.maxYear));
    if (query.minRating != null) params.set("minRating", String(query.minRating));
    query.genreIds?.forEach((id) => params.append("genreIds", String(id)));
    return params;
}

export const MovieApi = {
    getPaged: (query: MoviesQuery) =>
        apiClient
            .get<PagedResult<MovieSummary>>("/movies/paged", { params: buildMoviesParams(query) })
            .then((res) => res.data),
    getById: (id: number) => apiClient.get<MovieDetails>(`/movies/${id}`).then(res => res.data),
    getHero: async () => {
        const response = await apiClient.get<MovieCollection>("/MovieCollections/1");
        return response.data.items.map(item => item.movie);
    },
    search: (searchQuery: string, count = 5) =>
        apiClient.get<MovieSummary[]>("/Movies/search", { params: { searchQuery, count: count } }).then((res) => res.data),
};