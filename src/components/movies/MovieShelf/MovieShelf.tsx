import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MovieApi, PageSize, type MoviesQuery, type MovieSummary } from "@/api/movie";
import { MovieCard } from "../MovieCard/MovieCard";
import "./MovieShelf.css";

export type ShelfQuery = Omit<MoviesQuery, "pageNumber" | "pageSize">;

interface MovieShelfProps {
  title: string;
  query: ShelfQuery;
  seeAllTo: string;
  size?: PageSize;
}

export function MovieShelf({ title, query, seeAllTo, size = 6 }: MovieShelfProps) {
  const [movies, setMovies] = useState<MovieSummary[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let isStale = false;
    MovieApi.getPaged({ ...query, pageNumber: 1, pageSize: size })
      .then((res) => {
        if (!isStale) setMovies(res.items);
      })
      .catch((err) => {
        if (isStale) return;
        setFailed(true);
      });
    return () => {
      isStale = true;
    };
  }, [query, size]);


  if (failed || (movies && movies.length === 0)) return null;

  return (
    <section className="section">
      <div className="section__header">
        <h2 className="section__title">{title}</h2>
        <Link to={seeAllTo} className="section__link">
          Смотреть все →
        </Link>
      </div>

      <div className="shelf__row">
        {movies
          ? movies.map((movie) => (
            <div key={movie.id} className="shelf__item">
              <MovieCard movie={movie} />
            </div>
          ))
          : Array.from({ length: size }).map((_, i) => <div key={i} className="shelf__skeleton" />)}
      </div>
    </section>
  );
}