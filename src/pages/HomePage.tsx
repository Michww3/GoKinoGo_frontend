import "./HomePage.css";
import React, { useState, useEffect } from "react";
import { type Movie, MovieApi } from "../api/movie";
import { Link, useSearchParams } from "react-router-dom";
import { MovieCard } from "@/components/MovieCard";
import { Genre, GenreApi } from "@/api/genre";

export function HomePage() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [activeGenreId, setActiveGenreId] = useState<number | null>(null);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q")?.toLowerCase() ?? "";

    useEffect(() => {
        MovieApi.getAll().then(setMovies);
        GenreApi.getAll().then(setGenres);
    }, []);

    const visibleMovies = movies
        .filter((movie) => (activeGenreId ? movie.genres.some((g) => g.id === activeGenreId) : true))
        .filter((movie) => movie.name.toLowerCase().includes(query));

    return (
        <div>
            <div className="genre-filter">
                <button
                    className={`genre-chip ${activeGenreId === null ? "genre-chip--active" : ""}`}
                    onClick={() => setActiveGenreId(null)}
                >
                    Все жанры
                </button>
                {genres.map((g) => (
                    <button
                        key={g.id}
                        className={`genre-chip ${activeGenreId === g.id ? "genre-chip--active" : ""}`}
                        onClick={() => setActiveGenreId(g.id)}
                    >
                        {g.name}
                    </button>
                ))}
            </div>

            <div className="movie-grid">
                {visibleMovies.map((movie) => (
                    <Link key={movie.id} to={`/movies/${movie.id}`}>
                        <MovieCard
                            posterUrl={movie.posterUrl}
                            title={movie.name}
                            releaseDate={new Date(movie.releaseDate).toLocaleDateString()}
                            genres={movie.genres}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
}