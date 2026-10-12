import { useSearchParams } from "react-router-dom";
import type { MoviesQuery, MovieSortOption } from "@/api/movie";

export interface MovieFiltersState {
  page: number;
  pageSize: number;
  q: string;
  genreIds: number[];
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  minRating?: number;
  sort: MovieSortOption;
}

const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_SORT: MovieSortOption = "dateDesc";

const DEFAULT_FILTERS: MovieFiltersState = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  q: "",
  genreIds: [],
  sort: DEFAULT_SORT,
};

function parseOptionalNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
}

export function filtersToSearchParams(f: MovieFiltersState): URLSearchParams {
  const params = new URLSearchParams();
  if (f.page !== 1) params.set("page", String(f.page));
  if (f.pageSize !== DEFAULT_PAGE_SIZE) params.set("pageSize", String(f.pageSize));
  if (f.q) params.set("q", f.q);
  if (f.genreIds.length > 0) params.set("genres", f.genreIds.join(","));
  if (f.minPrice != null) params.set("minPrice", String(f.minPrice));
  if (f.maxPrice != null) params.set("maxPrice", String(f.maxPrice));
  if (f.minYear != null) params.set("minYear", String(f.minYear));
  if (f.maxYear != null) params.set("maxYear", String(f.maxYear));
  if (f.minRating != null) params.set("minRating", String(f.minRating));
  if (f.sort !== DEFAULT_SORT) params.set("sort", f.sort);
  return params;
}

export function buildCatalogUrl(patch: Partial<MovieFiltersState> = {}): string {
  const qs = filtersToSearchParams({ ...DEFAULT_FILTERS, ...patch }).toString();
  return qs ? `/movies?${qs}` : "/movies";
}

export function useMovieFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: MovieFiltersState = {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || DEFAULT_PAGE_SIZE,
    q: searchParams.get("q") ?? "",
    genreIds: searchParams.get("genres")?.split(",").filter(Boolean).map(Number) ?? [],
    minPrice: parseOptionalNumber(searchParams.get("minPrice")),
    maxPrice: parseOptionalNumber(searchParams.get("maxPrice")),
    minYear: parseOptionalNumber(searchParams.get("minYear")),
    maxYear: parseOptionalNumber(searchParams.get("maxYear")),
    minRating: parseOptionalNumber(searchParams.get("minRating")),
    sort: (searchParams.get("sort") as MovieSortOption | null) ?? DEFAULT_SORT,
  };

  const updateFilters = (patch: Partial<MovieFiltersState>) => {
    const next: MovieFiltersState = { ...filters, ...patch };
    if (!("page" in patch)) next.page = 1;
    setSearchParams(filtersToSearchParams(next), { replace: true });
  };

  const toApiQuery = (): MoviesQuery => ({
    pageNumber: filters.page,
    pageSize: filters.pageSize,
    searchQuery: filters.q || undefined,
    genreIds: filters.genreIds.length > 0 ? filters.genreIds : undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minYear: filters.minYear,
    maxYear: filters.maxYear,
    minRating: filters.minRating,
    sortBy: filters.sort,
  });

  return { filters, updateFilters, toApiQuery };
}