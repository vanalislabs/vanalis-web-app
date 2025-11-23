import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { PaginatedApiResponse, PaginationQueryParams } from "@/types/api";
import type { ProjectEvent } from "@/types/project";
import { useEffect, useMemo, useState } from "react";
import { PROJECT_STATUS, ProjectStatus } from "@/constants/projectStatus";

export function useGetAllProjects(initial?: Partial<{
    search: string;
    status: ProjectStatus;
    perPage: number;
    page: number;
}>) {
  const [search, setSearch] = useState(initial?.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [status, setStatus] = useState<ProjectStatus>(initial?.status ?? PROJECT_STATUS.ALL);

  const [perPage, setPerPage] = useState(initial?.perPage ?? 10);
  const [currentPage, setCurrentPage] = useState(initial?.page ?? 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset page when params change
  useEffect(() => {
    setCurrentPage(1);
  }, [perPage]);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      perPage,
      search: debouncedSearch.trim() || undefined,
      status: status || undefined,
    }),
    [currentPage, perPage, debouncedSearch, status],
  );

  const {
    data: apiResponse,
    isLoading,
    error,
    isFetching,
  } = useQuery<PaginatedApiResponse<ProjectEvent[]>>({
    queryKey: ["projects", queryParams],
    queryFn: async () => {

      const res = await api.get(`/project/browse`, {
        params: queryParams
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = (value: ProjectStatus) => {
    setStatus(value);
    setCurrentPage(1);
  }

  return {
    search,
    perPage,
    currentPage,

    data: apiResponse?.data || [],
    totalPages: apiResponse?.meta?.totalPages || 1,
    totalData: apiResponse?.meta?.total || 0,

    isLoading,
    isFetching,
    error,

    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    handleStatusChange,
  };
}
