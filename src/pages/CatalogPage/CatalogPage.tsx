import "./CatalogPage.css";
import { useEffect, useState } from "react";
import { MovieApi, type MovieSummary, type PagedResult } from "@/api/movie";
import { GenreApi, type Genre } from "@/api/genre";
import { MovieCard } from "@/components/movies/MovieCard/MovieCard";
import { FilterSidebar } from "@/components/movies/FilterSidebar/FilterSidebar";
import { Pagination } from "@/components/pagination/Pagination";
import { PageSizeSelect } from "@/components/pagination/PaginationSortOptions/PageSizeSelect";
import { SortSelect } from "@/components/pagination/PaginationSortOptions/SortSelect";
import { useMovieFilters } from "@/hooks/useMovieFilters";
import { pluralizeRu } from "@/utils/format";

export function CatalogPage() {
  const { filters, updateFilters, toApiQuery } = useMovieFilters();
  const [result, setResult] = useState<PagedResult<MovieSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    GenreApi.getAll().then(setGenres).catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    let isStale = false;
    setIsLoading(true);

    const timeout = setTimeout(() => {
      MovieApi.getPaged(toApiQuery())
        .then((data) => {
          if (!isStale) setResult(data);
        })
        .catch((err) => {
          if (isStale) return;
          console.error("Failed to fetch movies:", err);
          setResult(null);
        })
        .finally(() => {
          if (!isStale) setIsLoading(false);
        });
    }, 200);

    return () => {
      isStale = true;
      clearTimeout(timeout);
    };
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
    <div className="catalog-layout container">
      <FilterSidebar genres={genres} filters={filters} onChange={updateFilters} />

      <div className="catalog-content">
        <div className="catalog-toolbar">
          <div className="catalog-toolbar__left">
            <input
              type="search"
              className="catalog-toolbar__search"
              placeholder="Фильтровать по названию"
              value={filters.q}
              onChange={(e) => updateFilters({ q: e.target.value })}
            />
            <span className="catalog-toolbar__count">
              {result
                ? `${result.totalCount} ${pluralizeRu(result.totalCount, "фильм", "фильма", "фильмов")}`
                : ""}
            </span>
          </div>
          <div className="catalog-toolbar__right">
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
            <Pagination
              page={filters.page}
              totalPages={result.totalPages}
              onChange={(page) => {
                updateFilters({ page });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}