import { formatRatingsCount } from "@/utils/format";
import "./RatingBadge.css";

interface RatingBadgeProps {
  rating: number;
  count?: number;
  size?: "sm" | "lg";
}

export function RatingBadge({ rating, count, size = "sm" }: RatingBadgeProps) {
  if (rating <= 0) return null;

  return (
    <span className={`rating-badge rating-badge--${size}`}>
      <span className="rating-badge__star" aria-hidden="true">★</span>
      {rating.toFixed(1)}
      {typeof count === "number" && count > 0 && (
        <span className="rating-badge__count">({formatRatingsCount(count)})</span>
      )}
    </span>
  );
}