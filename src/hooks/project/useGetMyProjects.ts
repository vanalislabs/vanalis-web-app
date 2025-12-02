import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { PaginatedApiResponse } from "@/types/api";
import type { ProjectEvent } from "@/types/project";
import { useEffect, useMemo, useState } from "react";
import { PROJECT_STATUS, ProjectStatus } from "@/constants/projectStatus";

export function useGetMyProjects(
  initial?: Partial<{
    status: ProjectStatus;
    perPage: number;
    page: number;
  }>,
) {
  const [status, setStatus] = useState<ProjectStatus>(
    initial?.status ?? PROJECT_STATUS.ALL,
  );

  const [perPage, setPerPage] = useState(initial?.perPage ?? 9);
  const [currentPage, setCurrentPage] = useState(initial?.page ?? 1);

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset page when params change
  useEffect(() => {
    setCurrentPage(1);
  }, [perPage]);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      perPage,
      status: status || undefined,
    }),
    [currentPage, perPage, status],
  );

  const {
    data: apiResponse,
    isLoading,
    error,
    isFetching,
  } = useQuery<PaginatedApiResponse<ProjectEvent[]>>({
    queryKey: ["my-projects", queryParams],
    queryFn: async () => {
      const res = await api.get(`/project/my-projects`, {
        params: queryParams,
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });

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
  };

  return {
    perPage,
    currentPage,

    data: apiResponse?.data || [],
    totalPages: apiResponse?.meta?.totalPages || 1,
    totalData: apiResponse?.meta?.total || 0,

    isLoading,
    isFetching,
    error,

    handlePerPageChange,
    handlePageChange,
    handleStatusChange,
  };
}
