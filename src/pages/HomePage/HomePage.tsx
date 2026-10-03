import "./HomePage.css";
import { useState, useEffect } from "react";
import { type Movie, MovieApi, MovieSummary, PagedResult } from "../../api/movie";
import { MovieCard } from "@/components/movies/MovieCard/MovieCard";
import { Genre, GenreApi } from "@/api/genre";
import { HeroCarousel } from "@/components/movies/HeroCarousel/HeroCarousel";
import { FilterSidebar } from "@/components/movies/FilterSidebar/FilterSidebar";
import { useMovieFilters } from "@/hooks/useMovieFilters";
import { Pagination } from "@/components/pagination/Pagination";
import { PageSizeSelect } from "@/components/pagination/PaginationSortOptions/PageSizeSelect";
import { SortSelect } from "@/components/pagination/PaginationSortOptions/SortSelect";
import { useSearchParams } from "react-router-dom";

export function HomePage() {
    const { filters, updateFilters, toApiQuery } = useMovieFilters();
    const [result, setResult] = useState<PagedResult<MovieSummary> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get("q") ?? "";

    const handleSearch = (value: string) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                if (value) next.set("q", value);
                else next.delete("q");
                next.delete("page");
                return next;
            },
            { replace: true }
        );
    };

    useEffect(() => {
        GenreApi.getAll().then(setGenres);
        MovieApi.getHero().then(setHeroMovies);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => {
            MovieApi.getPaged(toApiQuery())
                .then(setResult)
                .catch((err) => {
                    console.error("Failed to fetch movies:", err);
                    setResult(null);
                })
                .finally(() => setIsLoading(false));
        }, 200);
        return () => clearTimeout(timeout);
    }, [
        filters.page,
        filters.pageSize,
        filters.q,
        filters.sort,
        filters.genreIds.join(","),
        filters.minPrice,
        filters.maxPrice,
        filters.minYear,
        filters.maxYear,
        filters.minRating,
    ]);



    return (
        <div>
            <HeroCarousel movies={heroMovies} />
            <div className="home-layout container">
                <FilterSidebar genres={genres} filters={filters} onChange={updateFilters} />

                <div className="home-content">
                    <div className="home-toolbar">
                        <div className="home-toolbar__left">
                            <input
                                type="search"
                                className="home-toolbar__search"
                                placeholder="Фильтровать по названию"
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            <span className="home-toolbar__count">{result ? `${result.totalCount} фильмов` : ""}</span>
                        </div>
                        <div className="home-toolbar__right">
                            <SortSelect value={filters.sort} onChange={(sort) => updateFilters({ sort })} />
                            <PageSizeSelect value={filters.pageSize} onChange={(pageSize) => updateFilters({ pageSize })} />
                        </div>
                    </div>

                    {isLoading ? (
                        <p className="text-muted">Загрузка…</p>
                    ) : !result || result.items.length === 0 ? (
                        <p className="text-muted">Ничего не найдено — попробуйте изменить фильтры.</p>
                    ) : (
                        <>
                            <div className="movie-grid">
                                {result.items.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                            <Pagination page={filters.page} totalPages={result.totalPages} onChange={(page) => updateFilters({ page })} />
                        </>
                    )}
                </div>
            </div >
        </div >
    );
}