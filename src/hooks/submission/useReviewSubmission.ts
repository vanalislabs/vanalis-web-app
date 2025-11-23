import { useCallback, useState } from "react";
import { useNetworkVariable } from "@/networkConfig";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export interface ReviewSubmissionValues {
  projectId: string;
  submissionId: string;
  approved: boolean;
}

interface UseReviewSubmissionResult {
  reviewSubmission: (payload: ReviewSubmissionValues) => Promise<string>;
  isSubmitting: boolean;
  error: Error | null;
}

export function useReviewSubmission(): UseReviewSubmissionResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Network variables
  const vanalisPackageId = useNetworkVariable("vanalisPackageId");
  
  // Wallet & Client
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecute, isPending } = useSignAndExecuteTransaction();

  const reviewSubmission = useCallback(
    async (payload: ReviewSubmissionValues) => {
      setError(null);

      // 1. Validation Checks
      if (!account) {
        throw new Error("Please connect your wallet to review submissions.");
      }

      if (!vanalisPackageId) {
        throw new Error("Package ID is missing. Check network configuration.");
      }

      if (!payload.projectId || !payload.submissionId) {
        throw new Error("Invalid Project or Submission ID.");
      }

      setIsProcessing(true);

      try {
        const tx = new Transaction();

        // 2. Construct the Transaction
        tx.moveCall({
          target: `${vanalisPackageId}::project::review_submission`,
          arguments: [
            tx.object(payload.projectId),
            tx.object(payload.submissionId),
            tx.pure.bool(payload.approved),
            tx.object("0x6"), // The Clock Object
          ],
        });

        // 3. Execute Transaction
        const executionResult = await signAndExecute({ transaction: tx });
        const { digest } = executionResult;

        // 4. Wait for indexing (so UI updates immediately after)
        await suiClient.waitForTransaction({
          digest,
          options: {
            showEffects: true,
            // Only request what you actually need to reduce load
            showEvents: true, 
          },
        });

        return digest;

      } catch (err) {
        console.error("Review Submission Failed:", err);
        
        // Fix: Updated error message (was "Failed to create project")
        const nextError =
          err instanceof Error
            ? err
            : new Error("Failed to review submission. Please try again.");
        
        setError(nextError);
        throw nextError;
      } finally {
        setIsProcessing(false);
      }
    },
    [account, signAndExecute, suiClient, vanalisPackageId]
  );

  return {
    reviewSubmission,
    // Combine both loading states
    isSubmitting: isProcessing || isPending,
    error,
  };
}