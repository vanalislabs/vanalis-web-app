import { useNetworkVariable } from "@/networkConfig";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useParams } from "react-router";

export function useSuiSubmission() {
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const vanalisPackageId = useNetworkVariable("vanalisPackageId");
  const projectId = useParams<{ id?: string }>();
  const id = projectId?.id ?? "";
    const suiClient = useSuiClient();

  const submitToContract = async (
    encryptedPath: string, 
    blobId: string, 
    publicKey: string
  ) => {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${vanalisPackageId}::project::submit_data`,
      arguments: [
        tx.object(id),
        tx.pure.string(encryptedPath),
        tx.pure.string(blobId),
        tx.pure.string(publicKey),
        tx.object("0x6"),
      ],
    });

    const executionResult = await signAndExecute({ transaction: tx, });
    const { digest } = executionResult;
    return suiClient.waitForTransaction({
          digest,
          options: {
            showEffects: true,
            showEvents: true,
            showBalanceChanges: true,
          },
        });
  };

  return { submitToContract };
}