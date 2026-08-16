import "./HomePage.css";
import { useState, useEffect } from "react";
import { type Movie, MovieApi, MovieSummary } from "../api/movie";
import { useSearchParams } from "react-router-dom";
import { MovieCard } from "@/components/MovieCard";
import { Genre, GenreApi } from "@/api/genre";
import { HeroCarousel } from "@/components/HeroCarousel";

export function HomePage() {
    const [movies, setMovies] = useState<MovieSummary[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
    const [activeGenreId, setActiveGenreId] = useState<number | null>(null);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q")?.toLowerCase() ?? "";

    useEffect(() => {
        MovieApi.getAll().then(setMovies);
        GenreApi.getAll().then(setGenres);
        MovieApi.getHero().then(setHeroMovies);
    }, []);

    const visibleMovies = movies
        .filter((movie) => (activeGenreId ? movie.genres.some((g) => g.id === activeGenreId) : true))
        .filter((movie) => movie.name.toLowerCase().includes(query));

    return (
        <div>
            <HeroCarousel movies={heroMovies} />
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
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}