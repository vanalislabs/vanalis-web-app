import { useQuery } from "@tanstack/react-query";
import { useSuiClient } from "@mysten/dapp-kit";

export function useGetFullDatasetPath(objectId: string | undefined) {
  const client = useSuiClient();
  return useQuery({
    queryKey: ["full-dataset-path", objectId],
    queryFn: async () => {
      if (!objectId) return null;

      const response = await client.getObject({
        id: objectId,
        options: { showContent: true },
      });

      const content = response.data?.content;
      if (content && content.dataType === "moveObject") {
        return (content.fields as any)?.full_dataset_path;
      }
      return null;
    },
    enabled: !!objectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
