import "./Pagination.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="pagination" aria-label="Страницы">
      <button className="pagination__btn" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ← Назад
      </button>

      <div className="pagination__numbers">
        {pages.map((p, i) => (
          <span key={p} className="pagination__group">
            {i > 0 && pages[i - 1] !== p - 1 && <span className="pagination__dots">…</span>}
            <button
              className={`pagination__num ${p === page ? "pagination__num--active" : ""}`}
              onClick={() => onChange(p)}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          </span>
        ))}
      </div>

      <button className="pagination__btn" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Вперёд →
      </button>
    </nav>
  );
}