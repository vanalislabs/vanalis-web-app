import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { search } from "@/services/searchService";
import { SearchResults } from "@/types/search";

/**
 * Custom hook for debouncing a value
 */
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook for search functionality with debounce and TanStack Query
 */
export function useSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query, 400);

  const {
    data,
    isLoading,
    error,
  } = useQuery<SearchResults>({
    queryKey: ["search", debouncedQuery],
    queryFn: () => search(debouncedQuery),
    enabled: debouncedQuery.length >= 2, // Only search if query is at least 2 characters
    staleTime: 30000, // Cache results for 30 seconds
  });

  return {
    data: data || { projects: [], datasets: [], users: [] },
    isLoading,
    error,
    hasResults: Boolean(
      data &&
        (data.projects.length > 0 || data.datasets.length > 0 || data.users.length > 0)
    ),
  };
}

