import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { client } from "@/services/client"; 
import { WalrusFile } from "@mysten/walrus";

export function useWalrusUpload() {
  const account = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<"idle" | "encoding" | "registering" | "uploading" | "certifying">("idle");

  const uploadToWalrus = async (file: File): Promise<string> => {
    if (!account) throw new Error("Wallet not connected");
    
    setIsUploading(true);
    setStep("encoding");

    try {
      const fileBuffer = await file.arrayBuffer();
      const uint8Arr = new Uint8Array(fileBuffer);

      // Step 1: Create and encode flow
      const flow = client.walrus.writeFilesFlow({
        files: [
          WalrusFile.from({
            contents: uint8Arr,
            identifier: file.name,
            tags: {
              "content-type": file.type,
            }
          }),
        ],
      });

      await flow.encode();

      // Step 2: Register (Triggers Wallet Sign #1)
      setStep("registering");
      const registerTx = flow.register({
        epochs: 1, // Adjust epochs as needed
        owner: account.address,
        deletable: true,
      });

      const { digest } = await signAndExecute({ transaction: registerTx });

      // Step 3: Upload to storage nodes
      setStep("uploading");
      await flow.upload({ digest });

      // Step 4: Certify (Triggers Wallet Sign #2)
      setStep("certifying");
      const certifyTx = flow.certify();
      await signAndExecute({ transaction: certifyTx });

      // Step 5: Get Blob ID
      const files = await flow.listFiles();
      
      if (!files[0] || !files[0].blobId) {
        throw new Error("Upload succeeded but no Blob ID was returned");
      }
      // console.log("Returned blobId:", files[0].blobId);
      return files[0].blobId;

    } catch (error) {
      console.error("Walrus SDK Upload Failed:", error);
      throw error;
    } finally {
      setIsUploading(false);
      setStep("idle");
    }
  };

  return { 
    uploadToWalrus, 
    isUploadingWalrus: isUploading,
    walrusStep: step 
  };
}