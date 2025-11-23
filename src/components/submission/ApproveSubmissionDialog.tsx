import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader } from "lucide-react";

interface ApproveSubmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rewardLabel: string;
  onConfirm: () => void | Promise<void>;
  isSubmitting: boolean;
}

export function ApproveSubmissionDialog({
  open,
  onOpenChange,
  rewardLabel,
  onConfirm,
  isSubmitting,
}: ApproveSubmissionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Submission?</AlertDialogTitle>
          <AlertDialogDescription>
            Approving unlocks the full dataset and distributes {rewardLabel} to
            the contributor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? <Loader className="w-5 animate-spin" /> : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
