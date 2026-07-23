import { Genre } from "@/api/genre";
import "./MovieCard.css";

interface MovieCardProps {
  posterUrl: string;
  title: string;
  releaseDate: string;
  genres: Genre[];
}

export function MovieCard({ posterUrl, title, releaseDate, genres }: MovieCardProps) {
  return (
    <div className="movie-card">
      <img className="movie-card__poster" src={posterUrl} alt={title} />
      <div className="movie-card__body">
        <h3 className="movie-card__title">{title}</h3>
        <p className="movie-card__date">{releaseDate}</p>
        {genres && genres.length > 0 && (
          <div className="movie-card__genres">
            {genres.slice(0, 3).map((genre) => (
              <span key={genre.id} className="genre-chip">
                {genre.name}
              </span>
            ))}
            {genres.length > 3 && (
              <span className="genre-chip">+{genres.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}