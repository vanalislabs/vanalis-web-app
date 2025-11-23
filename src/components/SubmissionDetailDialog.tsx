import { useCallback, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Download,
  Loader,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Submission } from "@/types/submission";
import { submissionStatus } from "@/constants/submissionStatus";
import { getDate } from "@/lib/convertDate";
import { formattedSui } from "@/lib/convertDecimals";
import { useGetPreviewBlobId } from "@/hooks/useGetPreviewBlobId";
import { useWalrusImage } from "@/hooks/useWalrusImage";
import {
  ReviewSubmissionValues,
  useReviewSubmission,
} from "@/hooks/submission/useReviewSubmission";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { ApproveSubmissionDialog } from "@/components/submission/ApproveSubmissionDialog";
import { RejectSubmissionDialog } from "@/components/submission/RejectSubmissionDialog";

interface SubmissionDetailDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (submission: Submission) => void;
  onReject: (submission: Submission) => void;
}

export function SubmissionDetailDialog({
  submission,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: SubmissionDetailDialogProps) {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { data: previewBlobId, error: blobError } = useGetPreviewBlobId(
    submission?.id,
  );
  const { id: projectIdParam } = useParams();

  const { reviewSubmission, isSubmitting } = useReviewSubmission();

  const {
    imageUrl,
    isLoading: isLoadingImage,
    error: imageError,
  } = useWalrusImage(previewBlobId);

  const handleApproveClick = () => {
    setShowApproveConfirm(true);
  };

  const submitReview = useCallback(
    async (approved: boolean) => {
      if (!submission) {
        throw new Error("Missing submission context.");
      }

      if (!projectIdParam) {
        throw new Error("Missing project context.");
      }

      const payload: ReviewSubmissionValues = {
        projectId: projectIdParam,
        submissionId: submission.id,
        approved,
      };

      await reviewSubmission(payload);

      if (approved) {
        onApprove(submission);
        toast.success("Submission approved!");
      } else {
        onReject(submission);
        toast.success("Submission rejected!");
      }
    },
    [onApprove, onReject, projectIdParam, reviewSubmission, submission],
  );

  const handleApproveConfirm = async () => {
    try {
      await submitReview(true);
      setShowApproveConfirm(false);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve submission.");
    }
  };

  const handleRejectClick = () => {
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
    try {
      await submitReview(false);
      setShowRejectDialog(false);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject submission.");
    }
  };
  if (!submission || blobError) return null;

  const rewardLabel = `${formattedSui(
    submission.project.rewardPool,
    submission.project.targetSubmissions,
  )} SUI`;

  const status = submissionStatus[submission.status];
  const StatusIcon = status.icon;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-2">
                  {submission.project.title}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {submission.project.description}
                </DialogDescription>
              </div>
              <Badge className={status.className}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {status.label}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Contributor Info */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <Avatar className="h-12 w-12">
                {/* <AvatarImage src={submission.contributorAvatar} />
                <AvatarFallback>{submission.contributorName[0]}</AvatarFallback> */}
              </Avatar>
              <div className="flex-1">
                {/* <div className="font-semibold">{submission.contributor}</div> */}
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-3 w-3" />
                  {submission.contributor}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Timeline</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted: {getDate(submission.submittedAt)}</span>
                </div>
                {submission.reviewedAt > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Reviewed: {getDate(submission.reviewedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Reason */}
            {submission.status === "REJECTED" && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                {/* <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Rejection Reason</h4> */}
                {/* <p className="text-sm text-red-600 dark:text-red-300">{submission.rejectedReason}</p> */}
              </div>
            )}

            {/* Preview Dataset */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Preview Dataset</h4>
              {isLoadingImage && (
                <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg">
                  <Loader className="animate-spin w-7" />
                </div>
              )}
              {imageError && (
                <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load preview image
                  </p>
                </div>
              )}
              {imageUrl && !isLoadingImage && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={imageUrl}
                    alt="Preview dataset"
                    className="w-full h-auto object-contain max-h-96"
                  />
                </div>
              )}
            </div>

            {/* Full Dataset (if approved) */}
            {/* {submission.status === "APPROVED" && submission.fullDatasetUrl && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Full Dataset</h4>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">Full dataset unlocked</p>
                      {submission.fullDatasetSize && (
                        <p className="text-xs text-muted-foreground mt-1">Size: {submission.fullDatasetSize}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(submission.fullDatasetUrl, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            )} */}

            {/* Reward Info */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reward Amount</p>
                  <p className="text-lg font-bold text-primary">
                    {rewardLabel}
                  </p>
                </div>
                {submission.status === "APPROVED" && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Reward Distributed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {submission.status === "PENDING" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 sm:flex-initial"
                >
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRejectClick}
                  className="flex-1 sm:flex-initial"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  onClick={handleApproveClick}
                  className="flex-1 sm:flex-initial"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {submission.status !== "PENDING" && (
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ApproveSubmissionDialog
        open={showApproveConfirm}
        onOpenChange={setShowApproveConfirm}
        rewardLabel={rewardLabel}
        onConfirm={handleApproveConfirm}
        isSubmitting={isSubmitting}
      />

      <RejectSubmissionDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={handleRejectConfirm}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
