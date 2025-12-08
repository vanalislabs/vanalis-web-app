import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import { ProjectEvent } from "@/types/project";

export function useGetProjectById(id: string) {
  const query = useQuery<ProjectEvent>({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await api.get(`project/detail/${id}`);
      return data.data;
    },
    enabled: !!id && id.trim() !== "",
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });

  return query;
}
