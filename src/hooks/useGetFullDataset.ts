import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function useGetFullDataset(filePathKey: string) {
  const query = useQuery({
    queryKey: ["file-path-key", filePathKey],
    queryFn: async () => {
      const { data } = await api.get(`/storage/retrieve-url`, {
        params: {
            filePathKey,
        }
      });
      return data;
    },
    enabled: Boolean(filePathKey?.trim()),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });

  return query;
}
