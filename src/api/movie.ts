import axios from "axios";

export interface Movie{
    id: number,
    name: string,
    description: string,
    releaseDate: string,
    length: string,
    posterUrl: string,
}

export const MovieApi = {
    getAll: () => axios.get<Movie[]>("/api/movie").then(res => res.data),
    getById: (id: number) => axios.get<Movie>(`/api/movie/${id}`).then(res => res.data)
};