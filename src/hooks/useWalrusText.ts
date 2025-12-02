import { useEffect, useState } from "react";
import { client } from "@/services/client";

export function useWalrusText(blobId: string | undefined | null) {
  const [textUrl, setTextUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const base_url = import.meta.env.VITE_FILE_URL;

  useEffect(() => {
    let objectUrl: string | null = null;

    async function fetchImage() {
      if (!blobId) {
        setTextUrl(null);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const blob = await client.walrus.getBlob({ blobId });
        const [data] = await blob.files();
        // const blobBytes = await data.bytes();
        // const tags = await data.getTags();
        const identifier = await data.getIdentifier();
        // const fileBlob = new Blob([new Uint8Array(blobBytes)], {type: tags["content-type"]});
        // const fileUrl = URL.createObjectURL(fileBlob);
        // setImageUrl(fileUrl);
        const full_url = `${base_url}/v1/blobs/by-quilt-id/${blobId}/${identifier}`;
        setTextUrl(full_url);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch image"),
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [blobId]);

  return { textUrl, isLoading, error };
}
