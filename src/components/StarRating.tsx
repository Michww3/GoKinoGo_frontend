import "./StarRating.css";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  );
}

export function StarRating({ rating, maxStars = 10 }: StarRatingProps) {
  const fillPercent = Math.max(0, Math.min(100, (rating / maxStars) * 100));

  return (
    <div
      className="star-rating"
      role="img"
      aria-label={`Рейтинг ${rating.toFixed(1)} из ${maxStars}`}
    >
      <div className="star-rating__row star-rating__row--empty">
        {Array.from({ length: maxStars }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
      <div className="star-rating__row star-rating__row--filled" style={{ width: `${fillPercent}%` }}>
        {Array.from({ length: maxStars }).map((_, i) => (
          <StarIcon key={i} />
        ))}
      </div>
    </div>
  );
}