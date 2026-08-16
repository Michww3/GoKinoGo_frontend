import "./MovieDetailsPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { MovieApi, MovieDetails } from "@/api/movie";
import { useStore } from "@/stores/StoreContext";
import { formatDate, formatLength } from "@/utils/format";
import { CommentSection } from "@/components/CommentSection";
import { RatingBadge } from "@/components/RatingBadge";

export const MovieDetailsPage = observer(function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { cart } = useStore();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setMovie(null);
    setNotFound(false);
    MovieApi.getById(Number(id))
      .then(setMovie)
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="movie-details movie-details--empty">
        <p>404 Фильм не найден</p>
        <Link to="/">← Вернуться к афише</Link>
      </div>
    );
  }

  if (!movie) {
    return <div className="movie-details movie-details--empty">Загрузка…</div>;
  }

  const cartItem = cart.items.find((i) => i.movieId === movie.id);

  return (
    <div className="movie-details">
      <Link to="/" className="movie-details__back">
        ← К афише
      </Link>

      <div className="movie-details__layout">
        <img className="movie-details__poster" src={movie.posterUrl} alt={movie.name} />

        <div className="movie-details__info">
          <h1 className="movie-details__title">{movie.name}</h1>

          {movie.averageRating > 0 && (
            <div className="movie-details__rating">
              <RatingBadge rating={movie.averageRating} count={movie.ratingsCount} size="lg" />
            </div>
          )}

          <p className="movie-details__meta">
            <span>{formatDate(movie.releaseDate)}</span>
            <span aria-hidden="true">·</span>
            <span>{formatLength(movie.length)}</span>
          </p>

          {movie.genres.length > 0 && (
            <div className="movie-details__genres">
              {movie.genres.map((g) => (
                <span key={g.id} className="movie-details__genre-chip">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          <p className="movie-details__description">{movie.description}</p>

          <div className="movie-details__purchase">
            <span className="movie-details__price">{movie.price} BYN</span>

            {cartItem ? (
              <div className="movie-details__qty">
                <button onClick={() => cart.setQuantity(movie.id, cartItem.quantity - 1)}>−</button>
                <span>{cartItem.quantity}</span>
                <button onClick={() => cart.setQuantity(movie.id, cartItem.quantity + 1)}>+</button>
              </div>
            ) : (
              <button
                className="movie-details__add-btn"
                onClick={() =>
                  cart.addItem({ id: movie.id, name: movie.name, posterUrl: movie.posterUrl, price: movie.price })
                }
              >
                В корзину
              </button>
            )}
          </div>
        </div>
      </div>
      <CommentSection movieId={movie.id} />
    </div>
  );
});