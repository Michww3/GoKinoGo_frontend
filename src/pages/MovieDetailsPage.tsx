import "./MovieDetailsPage.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MovieApi, type Movie } from "@/api/movie";
import { formatDate, formatLength } from "@/utils/format";
import { CommentSection } from "@/components/CommentSection";

export function MovieDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
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

    return (
        <div className="movie-details">
            <Link to="/" className="movie-details__back">
                ← К афише
            </Link>

            <div className="movie-details__layout">
                <img className="movie-details__poster" src={movie.posterUrl} alt={movie.name} />

                <div className="movie-details__info">
                    <h1 className="movie-details__title">{movie.name}</h1>

                    <p className="movie-details__meta">
                        <span>{formatDate(movie.releaseDate)}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatLength(movie.length)}</span>
                    </p>

                    {movie.genres.length > 0 && (
                        <div className="movie-details__genres">
                            {movie.genres.map((g) => (
                                <span key={g.id} className="genre-chip">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <p className="movie-details__description">{movie.description}</p>
                </div>
            </div>
            <CommentSection movieId={movie.id} />
        </div>
    );
}