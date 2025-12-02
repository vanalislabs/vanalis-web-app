import { useState } from "react";
import { useUploadFullDataset } from "./useUploadFullDataset"; // Your existing hook
import { useWalrusUpload } from "./useWalrusUpload";
import { useGetKeypair } from "./useGetKeypair";
import { useSuiSubmission } from "./useSuiSubmission";
import { encryptFilePath } from "@/utils/encryption";
import toast from "react-hot-toast";

type WorkflowStatus =
  | "idle"
  | "uploading_full"
  | "fetching_keys"
  | "encrypting"
  | "uploading_walrus"
  | "submitting_chain"
  | "success"
  | "error";

export function useSubmitWorkflow(onSuccess?: () => void) {
  const [status, setStatus] = useState<WorkflowStatus>("idle");

  // 1. Initialize all atomic hooks
  const { uploadFullDataset } = useUploadFullDataset();
  const { mutateAsync: getKeypair } = useGetKeypair();
  const { uploadToWalrus, walrusStep } = useWalrusUpload();
  const { submitToContract } = useSuiSubmission();

  const startWorkflow = async (fullFile: File, previewFile: File) => {
    try {
      // Step 1: Upload Full Dataset (Centralized)
      setStatus("uploading_full");
      const fullUploadResponse = await uploadFullDataset(fullFile);
      const { filePathKey } = fullUploadResponse;
      // console.log("filePathKey: ",filePathKey);

      // Step 2: Get Keypair
      setStatus("fetching_keys");
      const keyData = await getKeypair();
      // console.log("public key: ", keyData.data.publicKey);
      // console.log("private key: ", keyData.data.privateKey);

      // Step 3: Encrypt the Key
      setStatus("encrypting");
      const cipherText = await encryptFilePath(
        filePathKey,
        keyData.data.publicKey,
      );
      //   console.log(cipherText);

      // Step 4: Upload Preview to Walrus
      setStatus("uploading_walrus");
      const {blobId, txDigest: walrusTxDigest} = await uploadToWalrus(previewFile);
      // console.log(blobId);

      // Step 5: Submit to Sui Smart Contract
      setStatus("submitting_chain");
      const suiTxResult = await submitToContract(
        blobId,
        cipherText,
        keyData.data.publicKey,
      );
      //   console.log(res);

      setStatus("success");
      toast.success("Dataset successfully submitted to chain!");
      onSuccess?.();
      return {
        blobId,
        walrusTxDigest,
        suiTxDigest: suiTxResult.digest
      };

    } catch (error) {
      console.error("Workflow failed:", error);
      setStatus("error");
      toast.error("Submission workflow failed. Check console.");
    }
  };

  return {
    startWorkflow,
    status,
    walrusStep,
    isLoading: status !== "idle" && status !== "success" && status !== "error",
  };
}
