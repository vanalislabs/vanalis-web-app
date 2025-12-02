import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { PaginatedApiResponse } from "@/types/api";
import type { ProjectEvent } from "@/types/project";

export function useGetProjectFeatured() {

  const {
    data: apiResponse,
    isLoading,
    error,
    isFetching,
  } = useQuery<PaginatedApiResponse<ProjectEvent[]>>({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const res = await api.get(`/project/featured`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  });

  return {
    data: apiResponse?.data || [],
    totalPages: apiResponse?.meta?.totalPages || 1,
    totalData: apiResponse?.meta?.total || 0,

    isLoading,
    isFetching,
    error,

  };
}
