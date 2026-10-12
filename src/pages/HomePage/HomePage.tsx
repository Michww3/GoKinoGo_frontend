import "./HomePage.css";
import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { MovieApi, type Movie } from "@/api/movie";
import { GenreApi, type Genre } from "@/api/genre";
import { HeroCarousel } from "@/components/movies/HeroCarousel/HeroCarousel";
import { MovieShelf, type ShelfQuery } from "@/components/movies/MovieShelf/MovieShelf";
import { buildCatalogUrl } from "@/hooks/useMovieFilters";

interface Preset {
  title: string;
  subtitle: string;
  hue: number;
  to: string;
}

const PRESETS: Preset[] = [
  { title: "Лучшее", subtitle: "Рейтинг 8 и выше", hue: 350, to: buildCatalogUrl({ minRating: 8, sort: "ratingDesc" }) },
  { title: "Новые 2020-е", subtitle: "Фильмы с 2020 года", hue: 210, to: buildCatalogUrl({ minYear: 2020 }) },
  { title: "Десятые", subtitle: "2010 — 2019", hue: 160, to: buildCatalogUrl({ minYear: 2010, maxYear: 2019 }) },
  { title: "Классика", subtitle: "До 1999 года", hue: 38, to: buildCatalogUrl({ maxYear: 1999, sort: "ratingDesc" }) },
];

interface Shelf {
  id: string;
  title: string;
  query: ShelfQuery;
  seeAllTo: string;
}

const SHELVES: Shelf[] = [
  { id: "new", title: "Новинки", query: { sortBy: "dateDesc" }, seeAllTo: buildCatalogUrl({ sort: "dateDesc" }) },
  { id: "top", title: "Лучшие по рейтингу", query: { sortBy: "ratingDesc" }, seeAllTo: buildCatalogUrl({ sort: "ratingDesc" }) },
  { id: "added", title: "Недавно добавленные", query: { sortBy: "recentlyAdded" }, seeAllTo: buildCatalogUrl({ sort: "recentlyAdded" }) },
];

export function HomePage() {
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    MovieApi.getHero().then(setHeroMovies).catch(() => setHeroMovies([]));
    GenreApi.getAll().then(setGenres).catch(() => setGenres([]));
  }, []);

  return (
    <div className="home-page">
      <HeroCarousel movies={heroMovies} />

      <section className="section">
        <div className="section__header">
          <h2 className="section__title">Подборки</h2>
          <Link to="/movies" className="section__link">
            Весь каталог →
          </Link>
        </div>
        <div className="preset-grid">
          {PRESETS.map((p) => (
            <Link key={p.title} to={p.to} className="preset-tile" style={{ "--hue": p.hue } as CSSProperties}>
              <span className="preset-tile__arrow" aria-hidden="true">
                →
              </span>
              <span className="preset-tile__title">{p.title}</span>
              <span className="preset-tile__subtitle">{p.subtitle}</span>
            </Link>
          ))}
        </div>
      </section>

      {SHELVES.map((shelf) => (
        <MovieShelf key={shelf.id} title={shelf.title} query={shelf.query} seeAllTo={shelf.seeAllTo} />
      ))}

      {genres.length > 0 && (
        <section className="section">
          <div className="section__header">
            <h2 className="section__title">Жанры</h2>
          </div>
          <div className="genre-links">
            {genres.map((g) => (
              <Link key={g.id} to={buildCatalogUrl({ genreIds: [g.id] })} className="genre-link">
                {g.name}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}