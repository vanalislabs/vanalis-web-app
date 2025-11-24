import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import toast from "react-hot-toast";
import api from "@/services/api";
import type { ApiError } from "@/types/api";

interface UploadResponse {
	data: {
		filePathKey: string;
	}
}

export function useUploadFullDataset() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post<UploadResponse>(
        "/upload/full-dataset",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data.data;
    },
    onError: (err: AxiosError<ApiError>) => {
      console.error(err);
      toast.error(
        `${err?.response?.data?.message}: ${err?.response?.data?.error}`,
      );
    },
  });

  return { uploadFullDataset: mutateAsync, isUploadingFull: isPending };
}
