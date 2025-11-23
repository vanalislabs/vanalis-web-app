import { useMutation } from "@tanstack/react-query";
import { generateKeypair } from "@/services/submissionServices";

export function useGetKeypair() {
  return useMutation({
    mutationFn: generateKeypair,
  });
}