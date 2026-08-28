import type { MovieSortOption } from "@/api/movie";
import "./PaginationSortOptions.css";

const OPTIONS: { value: MovieSortOption; label: string }[] = [
  { value: "dateDesc", label: "Сначала новые" },
  { value: "dateAsc", label: "Сначала старые" },
  { value: "ratingDesc", label: "По рейтингу" },
  { value: "recentlyAdded", label: "Недавно добавленные" },
];

export function SortSelect({ value, onChange }: { value: MovieSortOption; onChange: (v: MovieSortOption) => void }) {
  return (
    <select className="sort-select" value={value} onChange={(e) => onChange(e.target.value as MovieSortOption)}>
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}