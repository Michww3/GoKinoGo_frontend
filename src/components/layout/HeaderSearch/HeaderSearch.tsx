import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovieApi, type MovieSummary } from "@/api/movie";
import { useClickOutside } from "@/hooks/useClickOutside";
import "./HeaderSearch.css";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;

export function HeaderSearch() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [results, setResults] = useState<MovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false), isOpen);

  useEffect(() => {
    const query = value.trim();
    if (query.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    let isStale = false;
    setIsLoading(true);

    const timeout = setTimeout(() => {
      MovieApi.search(query)
        .then((data) => {
          if (isStale) return;
          setResults(data);
          setIsOpen(true);
        })
        .finally(() => {
          if (!isStale) setIsLoading(false);
        });
    }, DEBOUNCE_MS);

    return () => {
      isStale = true;
      clearTimeout(timeout);
    };
  }, [value]);

  const goToMovie = (id: number) => {
    setIsOpen(false);
    setValue("");
    navigate(`/movies/${id}`);
  };

  const showAllResults = () => {
    setIsOpen(false);
    navigate(`/?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <div className="header-search" ref={containerRef}>
      <input
        type="search"
        className="header-search__input"
        placeholder="Найти фильм…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => results.length > 0 && setIsOpen(true)}
      />

      {isOpen && (
        <div className="header-search__dropdown">
          {isLoading ? (
            <p className="header-search__status">Ищем…</p>
          ) : results.length === 0 ? (
            <p className="header-search__status">Ничего не найдено</p>
          ) : (
            <>
              <ul className="header-search__list">
                {results.map((movie) => (
                  <li key={movie.id}>
                    <button className="header-search__item" onClick={() => goToMovie(movie.id)}>
                      <img src={movie.posterUrl} alt={movie.name} className="header-search__poster" />
                      <div className="header-search__info">
                        <span className="header-search__name">{movie.name}</span>
                        <span className="header-search__year">{new Date(movie.releaseDate).getFullYear()}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              <button className="header-search__show-all" onClick={showAllResults}>
                Показать все результаты →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}