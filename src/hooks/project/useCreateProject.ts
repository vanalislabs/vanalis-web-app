import { useCallback, useState } from "react";
import { parseDecimalToBigInt } from "@/lib/convertDecimals";
import { useNetworkVariable } from "@/networkConfig";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

export interface CreateProjectFormValues {
  title: string;
  imageUrl: string;
  description: string;
  dataType: string;
  category: string;
  deadline: string;
  goal: string;
  rewardPool: string;
  requirements: string[];
}

interface UseCreateProjectResult {
  createProject: (payload: CreateProjectFormValues) => Promise<string>;
  isSubmitting: boolean;
  error: Error | null;
}

const SUI_COIN_TYPE = "0x2::sui::SUI";

export function useCreateProject(): UseCreateProjectResult {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const vanalisPackageId = useNetworkVariable("vanalisPackageId");
  const projectRegistryObjectId = useNetworkVariable("projectRegistryObjectId");
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const { mutateAsync: signAndExecute, isPending } =
    useSignAndExecuteTransaction();

  const createProject = useCallback(
    async (payload: CreateProjectFormValues) => {
      setError(null);

      if (!account) {
        throw new Error("Please connect your wallet to create a project.");
      }

      if (!vanalisPackageId || !projectRegistryObjectId) {
        throw new Error("Project registry configuration is missing.");
      }

      const totalBase = parseDecimalToBigInt(payload.rewardPool);
      if (totalBase == null || totalBase <= 0n) {
        throw new Error("Reward pool must be greater than zero.");
      }

      const targetSubmissions = BigInt(payload.goal || "0");
      if (targetSubmissions <= 0n) {
        throw new Error("Submission goal must be greater than zero.");
      }

      const rewardPerBase = totalBase / targetSubmissions;
      if (rewardPerBase === 0n) {
        throw new Error(
          "Calculated reward per submission is 0. Adjust reward pool or goal.",
        );
      }

      const ts = Date.parse(payload.deadline);
      if (Number.isNaN(ts)) {
        throw new Error("Invalid deadline provided.");
      }

      if (ts <= Date.now()) {
        throw new Error("Deadline must be in the future.");
      }

      const deadlineMs = BigInt(ts);

      const { totalBalance } = await suiClient.getBalance({
        owner: account.address,
        coinType: SUI_COIN_TYPE,
      });

      if (BigInt(totalBalance) < totalBase) {
        throw new Error("Insufficient SUI balance for the reward pool.");
      }

      setIsProcessing(true);

      try {
        const tx = new Transaction();
        const rewardCoin = tx.splitCoins(tx.gas, [tx.pure.u64(totalBase)]);

        tx.moveCall({
          target: `${vanalisPackageId}::project::create_project`,
          arguments: [
            tx.object(projectRegistryObjectId),
            tx.pure.string(payload.title),
            tx.pure.string(payload.description),
            tx.pure.vector("string", payload.requirements),
            tx.pure.string(payload.dataType),
            tx.pure.string(payload.category),
            tx.pure.string(payload.imageUrl),
            rewardCoin,
            tx.pure.u64(rewardPerBase),
            tx.pure.u64(targetSubmissions),
            tx.pure.u64(deadlineMs),
            tx.object("0x6"),
          ],
        });

        const executionResult = await signAndExecute({ transaction: tx });
        const { digest } = executionResult;

        await suiClient.waitForTransaction({
          digest,
          options: {
            showEffects: true,
            showEvents: true,
            showBalanceChanges: true,
          },
        });

        return digest;
      } catch (err) {
        const nextError =
          err instanceof Error
            ? err
            : new Error("Failed to create project. Please try again.");
        setError(nextError);
        throw nextError;
      } finally {
        setIsProcessing(false);
      }
    },
    [
      account,
      projectRegistryObjectId,
      signAndExecute,
      suiClient,
      vanalisPackageId,
    ],
  );

  return {
    createProject,
    isSubmitting: isProcessing || isPending,
    error,
  };
}
