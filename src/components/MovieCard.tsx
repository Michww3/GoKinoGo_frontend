import "./MovieCard.css";

interface MovieCardProps {
  posterUrl: string;
  title: string;
  releaseDate: string;
}

export function MovieCard({ posterUrl, title, releaseDate }: MovieCardProps) {
  return (
    <div className="movie-card">
      <img className="movie-card__poster" src={posterUrl} alt={title} />
      <div className="movie-card__body">
        <h3 className="movie-card__title">{title}</h3>
        <p className="movie-card__date">{releaseDate}</p>
      </div>
    </div>
  );
}