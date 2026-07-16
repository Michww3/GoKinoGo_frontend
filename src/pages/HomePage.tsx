import React, { useState, useEffect } from "react";
import { type Movie, MovieApi } from "../api/movie";
import { Link } from "react-router-dom";
import { MovieCard } from "@/components/MovieCard";

export function HomePage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        MovieApi.getAll().then(setMovies);
    }, []);

    return (
        <div className="movie-grid">
            {
                movies.map((movie) => (
                    <Link key={movie.id} to={`/movies/${movie.id}`}>
                        <MovieCard posterUrl={movie.posterUrl} title={movie.name} releaseDate={new Date(movie.releaseDate).toLocaleDateString()} />
                    </Link>
                ))
            }
        </div>
    )
}