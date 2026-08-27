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

function parseOptionalNumber(value: string | null): number | undefined {
    if (!value) return undefined;
    const num = Number(value);
    return Number.isNaN(num) ? undefined : num;
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
        sort: (searchParams.get("sort") as MovieSortOption) ?? DEFAULT_SORT,
    };

    const updateFilters = (patch: Partial<MovieFiltersState>) => {
        const next: MovieFiltersState = { ...filters, ...patch };

        if (!("page" in patch)) next.page = 1;

        const params = new URLSearchParams();
        if (next.page !== 1) params.set("page", String(next.page));
        if (next.pageSize !== DEFAULT_PAGE_SIZE) params.set("pageSize", String(next.pageSize));
        if (next.q) params.set("q", next.q);
        if (next.genreIds.length > 0) params.set("genres", next.genreIds.join(","));
        if (next.minPrice != null) params.set("minPrice", String(next.minPrice));
        if (next.maxPrice != null) params.set("maxPrice", String(next.maxPrice));
        if (next.minYear != null) params.set("minYear", String(next.minYear));
        if (next.maxYear != null) params.set("maxYear", String(next.maxYear));
        if (next.minRating != null) params.set("minRating", String(next.minRating));
        if (next.sort !== DEFAULT_SORT) params.set("sort", next.sort);

        setSearchParams(params, { replace: true });
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