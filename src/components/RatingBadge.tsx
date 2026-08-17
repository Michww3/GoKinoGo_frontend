import { formatRatingsCount } from "@/utils/format";
import "./RatingBadge.css";
import { StarRating } from "./StarRating";

interface RatingBadgeProps {
  rating: number;
  count?: number;
  size?: "sm" | "lg";
}

export function RatingBadge({ rating, count, size = "sm" }: RatingBadgeProps) {
  if (rating <= 0) return null;

  if (size === "lg") {
    return (
      <div className="rating-badge rating-badge--lg">
        <StarRating rating={rating} />
        <span className="rating-badge__value">{rating.toFixed(1)}</span>
        {typeof count === "number" && count > 0 && (
          <span className="rating-badge__count">({formatRatingsCount(count)})</span>
        )}
      </div>
    );
  }

  return (
    <span className="rating-badge rating-badge--sm">
      <span className="rating-badge__star" aria-hidden="true">★</span>
      {rating.toFixed(1)}
    </span>
  );
}