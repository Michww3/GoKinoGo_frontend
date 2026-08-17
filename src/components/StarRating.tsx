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

export function StarRating({ rating, maxStars = 10, }: StarRatingProps) {
    const normalizedRating = Math.max(0, Math.min(rating, maxStars));

    return (
        <div
            className="star-rating"
            role="img"
            aria-label={`Рейтинг ${rating.toFixed(1)} из ${maxStars}`}
        >
            {Array.from({ length: maxStars }).map((_, index) => {
                const fill = Math.max(
                    0,
                    Math.min(1, normalizedRating - index)
                );

                return (
                    <div className="star-rating__star" key={index}>
                        <div className="star-rating__empty">
                            <StarIcon />
                        </div>

                        <div
                            className="star-rating__filled"
                            style={{ width: `${fill * 100}%` }}
                        >
                            <StarIcon />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}