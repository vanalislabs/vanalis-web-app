import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { PaginatedApiResponse } from "@/types/api";
import { useEffect, useMemo, useState } from "react";
import {
  SUBMISSION_STATUS,
  SubmissionStatus,
} from "@/constants/submissionStatus";
import { Submission } from "@/types/submission";

export function useGetMySubmissions(
  initial?: Partial<{
    status: SubmissionStatus;
    perPage: number;
    page: number;
  }>,
) {
  const [status, setStatus] = useState<SubmissionStatus>(
    initial?.status ?? SUBMISSION_STATUS.ALL,
  );

  const [perPage, setPerPage] = useState(initial?.perPage ?? 10);
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
  } = useQuery<PaginatedApiResponse<Submission[]>>({
    queryKey: ["submissions", queryParams],
    queryFn: async () => {
      const res = await api.get(`/project/my-submissions`, {
        params: queryParams,
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleStatusChange = (value: SubmissionStatus) => {
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
