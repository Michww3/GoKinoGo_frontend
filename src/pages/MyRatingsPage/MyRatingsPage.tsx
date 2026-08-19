import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserApi, type UserRating } from "@/api/user";
import { StarRating } from "@/components/ratings/StarRating/StarRating";
import "./MyRatingsPage.css";

export function MyRatingsPage() {
  const [ratings, setRatings] = useState<UserRating[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    UserApi.getRatings()
      .then(setRatings)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div className="my-ratings my-ratings--empty">Загрузка…</div>;
  }

  if (ratings.length === 0) {
    return (
      <div className="my-ratings my-ratings--empty">
        <h1>Мои оценки</h1>
        <p className="text-muted">Вы ещё не оценили ни одного фильма.</p>
        <Link to="/" className="my-ratings__link">
          ← К афише
        </Link>
      </div>
    );
  }

  return (
    <div className="my-ratings">
      <h1 className="my-ratings__title">Мои оценки</h1>

      <ul className="my-ratings__list">
        {ratings.map((r) => (
          <li key={r.id} className="rating-row">
            <Link to={`/movies/${r.movie.id}`}>
              <img src={r.movie.posterUrl} alt={r.movie.name} className="rating-row__poster" />
            </Link>

            <div className="rating-row__info">
              <Link to={`/movies/${r.movie.id}`} className="rating-row__name">
                {r.movie.name}
              </Link>

              {r.movie.genres.length > 0 && (
                <p className="rating-row__genres">{r.movie.genres.map((g) => g.name).join(", ")}</p>
              )}

              <div className="rating-row__stars">
                <StarRating rating={r.value} />
                <span className="rating-row__value">{r.value.toFixed(1)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}