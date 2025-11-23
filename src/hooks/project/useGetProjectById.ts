import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function useGetProjectById(id: string) {
	const { data, isLoading, error } = useQuery({
		queryKey: ["project", id],
		queryFn: async () => {
			if (!id) return null;
			const { data } = await api.get(`project/detail/${id}`);
			return data;
		},
		enabled: !!id && id.trim() !== "",
		staleTime: 0,
  		refetchOnWindowFocus: false,
		refetchOnMount: 'always',
	});

	return { data, isLoading, error };
}
