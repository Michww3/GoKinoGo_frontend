import { useState } from "react";
import { Link } from "react-router-dom";
import type { Movie } from "@/api/movie";
import { formatLength } from "@/utils/format";
import "./HeroCarousel.css";

export function HeroCarousel({ movies }: { movies: Movie[] }) {
  const [index, setIndex] = useState(0);

  if (movies.length === 0) return null;

  const goTo = (i: number) => {
    setIndex((i + movies.length) % movies.length);
  };

  return (
    <section className="hero">
      {movies.map((movie, i) => (
        <div key={movie.id} className={`hero__slide ${i === index ? "hero__slide--active" : ""}`}>
          <div className="hero__content">
            <h1 className="hero__title">{movie.name}</h1>

            <div className="hero__meta">
              <span>{movie.genres.map((g) => g.name).join(", ")}</span>
              <span className="hero__meta-dot" aria-hidden="true">
                •
              </span>
              <span>{formatLength(movie.length)}</span>
            </div>

            <p className="hero__description">{movie.description}</p>

            <Link to={`/movies/${movie.id}`} className="hero__cta">
              Подробнее →
            </Link>
          </div>

          <div className="hero__poster-wrap">
            <img src={movie.posterUrl} alt={movie.name} className="hero__poster" />
          </div>
        </div>
      ))}

      {movies.length > 1 && (
        <>
          <button className="hero__arrow hero__arrow--prev" onClick={() => goTo(index - 1)} aria-label="Предыдущий">
            ‹
          </button>
          <button className="hero__arrow hero__arrow--next" onClick={() => goTo(index + 1)} aria-label="Следующий">
            ›
          </button>

          <div className="hero__dots">
            {movies.map((_, i) => (
              <button
                key={i}
                className={`hero__dot ${i === index ? "hero__dot--active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Слайд ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}