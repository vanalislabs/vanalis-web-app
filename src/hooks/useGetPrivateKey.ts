import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function useGetPrivateKey(publicKey: string) {
  const query = useQuery({
    queryKey: ["private-key", publicKey],
    queryFn: async () => {
      const { data } = await api.get(`/keypair/retrieve`, {
        params: {
            publicKey,
        }
      });
      return data;
    },
    enabled: Boolean(publicKey?.trim()),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
  });

  return query;
}
