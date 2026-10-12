import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import type { MovieSummary } from "@/api/movie";
import { useStore } from "@/stores/StoreContext";
import "./MovieCard.css";
import { RatingBadge } from "../../ratings/RatingBadge/RatingBadge";
import BYN_symbol from "@/img/BYN_symbol.svg";
import { buildCatalogUrl } from "@/hooks/useMovieFilters";

interface MovieCardProps {
  movie: MovieSummary;
}

export const MovieCard = observer(function MovieCard({ movie }: MovieCardProps) {
  const { cart } = useStore();
  const cartItem = cart.items.find((item) => item.movieId === movie.id);


  return (
    <div className="movie-card">
      <div className="movie-card__poster-wrap">
        <Link to={`/movies/${movie.id}`} className="movie-card__poster-link">
          <img className="movie-card__poster" src={movie.posterUrl} alt={movie.name} />
        </Link>

        <RatingBadge rating={movie.averageRating} type="sm" />

        <div className="movie-card__overlay">
          <h3 className="movie-card__overlay-title">{movie.name}</h3>
          <div className="movie-card__overlay-actions">
            <Link to={`/movies/${movie.id}`} className="movie-card__btn movie-card__btn--outline">
              Подробнее
            </Link>
            {cartItem ? (
              <div className="movie-card__qty">
                <button onClick={() => cart.setQuantity(movie.id, cartItem.quantity - 1)}>−</button>
                <span>{cartItem.quantity}</span>
                <button onClick={() => cart.setQuantity(movie.id, cartItem.quantity + 1)}>+</button>
              </div>
            ) : (
              <button
                className="movie-card__btn movie-card__btn--solid"
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

      <div className="movie-card__body">
        <Link to={`/movies/${movie.id}`}>
          <h3 className="movie-card__title">{movie.name}</h3>
        </Link>
        <div className="movie-card__row">
          <p className="movie-card__date">{new Date(movie.releaseDate).toLocaleDateString()}</p>
          <p className="movie-card__price">
            {movie.price}
            <BYN_symbol aria-hidden="true" />
          </p>
        </div>
        {movie.genres.length > 0 && (
          <div className="movie-card__genres">
            {movie.genres.slice(0, 3).map((genre) => (
              <Link key={genre.id} to={buildCatalogUrl({ genreIds: [genre.id] })} className="genre-chip">
                {genre.name}
              </Link>
            ))}
            {movie.genres.length > 3 && <span className="genre-chip">+{movie.genres.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  );
});