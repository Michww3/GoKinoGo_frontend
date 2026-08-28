import "./PaginationSortOptions.css";

const OPTIONS = [12, 24, 48];

export function PageSizeSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <select className="page-size-select" value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {OPTIONS.map((size) => (
        <option key={size} value={size}>
          {size} на странице
        </option>
      ))}
    </select>
  );
}