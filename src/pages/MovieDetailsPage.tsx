import "./MovieDetailsPage.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieApi, type Movie } from "../api/movie";

export function MovieDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        if (id) {
            MovieApi.getById(Number(id)).then(setMovie);
        }
    }, [id]);

    if (!movie) {
        return <div>Загрузка...</div>;
    }

    return (
        <div className="movie-details">
            <img
                className="movie-details__poster"
                src={movie.posterUrl}
                alt={movie.name}
            />
            <div className="movie-details__info">
                <h1 className="movie-details__title">{movie.name}</h1>
                <p className="movie-details__meta">
                    {new Date(movie.releaseDate).toLocaleDateString()} · {movie.length}
                </p>
                <p className="movie-details__description">{movie.description}</p>
            </div>
        </div>
    );
}
