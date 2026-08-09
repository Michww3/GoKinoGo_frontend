import { useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import type { Movie } from "@/api/movie";
import { useStore } from "@/stores/StoreContext";
import { formatLength } from "@/utils/format";
import "./HeroCarousel.css";

export const HeroCarousel = observer(function HeroCarousel({ movies }: { movies: Movie[] }) {
  const { cart } = useStore();
  const [index, setIndex] = useState(0);

  if (movies.length === 0) return null;

  const goTo = (i: number) => {
    setIndex((i + movies.length) % movies.length);
  };

  return (
    <section className="hero">
      {movies.map((movie, i) => {
        const cartItem = cart.items.find((item) => item.movieId === movie.id);

        return (
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

              <div className="hero__actions">
                <span className="hero__price">{movie.price} BYN</span>
                <Link to={`/movies/${movie.id}`} className="hero__cta hero__cta--outline">
                  Подробнее →
                </Link>
                {cartItem ? (
                  <div className="hero__qty">
                    <button onClick={() => cart.setQuantity(movie.id, cartItem.quantity - 1)}>−</button>
                    <span>{cartItem.quantity}</span>
                    <button onClick={() => cart.setQuantity(movie.id, cartItem.quantity + 1)}>+</button>
                  </div>
                ) : (
                  <button
                    className="hero__cta hero__cta--solid"
                    onClick={() =>
                      cart.addItem({ id: movie.id, name: movie.name, posterUrl: movie.posterUrl, price: movie.price })
                    }
                  >
                    В корзину
                  </button>
                )}
              </div>
            </div>

            <div className="hero__poster-wrap">
              <img src={movie.posterUrl} alt={movie.name} className="hero__poster" />
            </div>
          </div>
        )
      })}

      {
          movies.length > 1 && (
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
          )
        }
    </section>
  );
});