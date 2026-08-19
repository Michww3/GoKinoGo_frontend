import "./MovieDetailsPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { MovieApi, MovieDetails } from "@/api/movie";
import { RatingApi } from "@/api/rating";
import { useStore } from "@/stores/StoreContext";
import { formatDate, formatLength } from "@/utils/format";
import { CommentSection } from "@/components/comments/CommentSection/CommentSection";
import { RatingBadge } from "@/components/ratings/RatingBadge/RatingBadge";
import { UserRating } from "@/components/ratings/UserRating/UserRating"

export const MovieDetailsPage = observer(function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { auth } = useStore();
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

  const handleSaveRating = async (rating: number) => {
    await RatingApi.rate(movie.id, rating);

    const updatedMovie = await MovieApi.getById(movie.id);
    setMovie(updatedMovie);
  };

  const handleDeleteRating = async () => {
    await RatingApi.deleteRating(movie.id);

    const updatedMovie = await MovieApi.getById(movie.id);
    setMovie(updatedMovie);
  };

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

          <div className="movie-details__rating">
            {movie.ratingsCount > 0 ? (
              <RatingBadge
                rating={movie.averageRating}
                count={movie.ratingsCount}
                type="stars"
              />
            ) : (
              <span className="movie-details__no-rating">
                Нет оценок
              </span>
            )}
            {auth.isAuthenticated &&
              (
                < UserRating
                  rating={movie.userRating}
                  onSave={handleSaveRating}
                  onDelete={handleDeleteRating}
                />
              )}
          </div>

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