import { useEffect, useState } from "react";
import type { Genre } from "@/api/genre";
import type { MovieFiltersState } from "@/hooks/useMovieFilters";
import "./FilterSidebar.css";

interface FilterSidebarProps {
  genres: Genre[];
  filters: MovieFiltersState;
  onChange: (patch: Partial<MovieFiltersState>) => void;
}

const RATING_OPTIONS = [
  { value: undefined, label: "Любой" },
  { value: 5, label: "5+" },
  { value: 6, label: "6+" },
  { value: 7, label: "7+" },
  { value: 8, label: "8+" },
  { value: 9, label: "9+" },
];

export function FilterSidebar({ genres, filters, onChange }: FilterSidebarProps) {
  const [priceDraft, setPriceDraft] = useState({ min: filters.minPrice, max: filters.maxPrice });
  const [yearDraft, setYearDraft] = useState({ min: filters.minYear, max: filters.maxYear });

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({
        minPrice: priceDraft.min,
        maxPrice: priceDraft.max,
        minYear: yearDraft.min,
        maxYear: yearDraft.max,
      });
    }, 400);
    return () => clearTimeout(timeout);
  }, [priceDraft.min, priceDraft.max, yearDraft.min, yearDraft.max]);

  const toggleGenre = (id: number) => {
    const next = filters.genreIds.includes(id)
      ? filters.genreIds.filter((g) => g !== id)
      : [...filters.genreIds, id];
    onChange({ genreIds: next });
  };

  const hasActiveFilters =
    filters.genreIds.length > 0 ||
    filters.minPrice != null ||
    filters.maxPrice != null ||
    filters.minYear != null ||
    filters.maxYear != null ||
    filters.minRating != null;

  const resetAll = () => {
    setPriceDraft({ min: undefined, max: undefined });
    setYearDraft({ min: undefined, max: undefined });
    onChange({
      genreIds: [],
      minPrice: undefined,
      maxPrice: undefined,
      minYear: undefined,
      maxYear: undefined,
      minRating: undefined,
    });
  };

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar__header">
        <h2>Фильтры</h2>
        {hasActiveFilters && (
          <button className="filter-sidebar__reset" onClick={resetAll}>
            Сбросить
          </button>
        )}
      </div>

      <div className="filter-group">
        <h3>Жанры</h3>
        <div className="filter-group__genres">
          {genres.map((g) => (
            <label key={g.id} className="filter-checkbox">
              <input
                type="checkbox"
                checked={filters.genreIds.includes(g.id)}
                onChange={() => toggleGenre(g.id)}
              />
              {g.name}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h3>Цена, BYN</h3>
        <div className="filter-range">
          <input
            type="number"
            placeholder="От"
            min={0}
            value={priceDraft.min ?? ""}
            onChange={(e) => setPriceDraft((p) => ({ ...p, min: e.target.value ? Number(e.target.value) : undefined }))}
          />
          <span>—</span>
          <input
            type="number"
            placeholder="До"
            min={0}
            value={priceDraft.max ?? ""}
            onChange={(e) => setPriceDraft((p) => ({ ...p, max: e.target.value ? Number(e.target.value) : undefined }))}
          />
        </div>
      </div>

      <div className="filter-group">
        <h3>Год выхода</h3>
        <div className="filter-range">
          <input
            type="number"
            placeholder="От"
            value={yearDraft.min ?? ""}
            onChange={(e) => setYearDraft((y) => ({ ...y, min: e.target.value ? Number(e.target.value) : undefined }))}
          />
          <span>—</span>
          <input
            type="number"
            placeholder="До"
            value={yearDraft.max ?? ""}
            onChange={(e) => setYearDraft((y) => ({ ...y, max: e.target.value ? Number(e.target.value) : undefined }))}
          />
        </div>
      </div>

      <div className="filter-group">
        <h3>Рейтинг</h3>
        <div className="filter-group__rating">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              className={`rating-chip ${filters.minRating === opt.value ? "rating-chip--active" : ""}`}
              onClick={() => onChange({ minRating: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}