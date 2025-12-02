import { useState } from "react";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { submissionStatus } from "@/constants/submissionStatus";
import { Submission } from "@/types/submission";
import { useGetSubmissionById } from "@/hooks/submission/useGetSubmissionById";
import { getDate } from "@/lib/convertDate";
import { formattedSui } from "@/lib/convertDecimals";
import { ApproveSubmissionDialog } from "@/components/submission/ApproveSubmissionDialog";
import { RejectSubmissionDialog } from "@/components/submission/RejectSubmissionDialog";
import {
  ReviewSubmissionValues,
  useReviewSubmission,
} from "@/hooks/submission/useReviewSubmission";
import toast from "react-hot-toast";
import { useNetworkVariable } from "@/networkConfig";
import { ReceiptModal } from "./ReceiptModal";

interface SubmissionCardProps {
  submissionId: string;
  onViewDetails: (submission: Submission) => void;
  onReviewed?: () => void;
}

export function SubmissionCard({
  submissionId,
  onViewDetails,
  onReviewed,
}: SubmissionCardProps) {
  const { data, error, refetch } = useGetSubmissionById(submissionId);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [activeAction, setActiveAction] = useState<"approve" | "reject" | null>(
    null,
  );
  const { reviewSubmission, isSubmitting } = useReviewSubmission();

  const submission = data?.data as Submission | undefined;
  const [showReceipt, setShowReceipt] = useState(false);
  const [txDigest, setTxDigest] = useState("");
  const vanalisPackageId = useNetworkVariable("vanalisPackageId");
  const [review, setReview] = useState("");

  if (!submission || error) {
    return null;
  }
  const statusKey = (
    submission.status || "PENDING"
  ).toUpperCase() as keyof typeof submissionStatus;

  const config = submissionStatus[statusKey] ?? submissionStatus.PENDING;
  const StatusIcon = config.icon;
  const rewardLabel = `${formattedSui(
    submission.project.rewardPool,
    submission.project.targetSubmissions,
  )} SUI`;

  const projectId = submission.project?.id ?? submission.projectId ?? "";

  const handleReview = async (approved: boolean) => {
    if (!projectId) {
      toast.error("Missing project identifier.");
      return;
    }

    const targetAction = approved ? "approve" : "reject";

    try {
      setActiveAction(targetAction);

      const payload: ReviewSubmissionValues = {
        projectId,
        submissionId: submission.id,
        approved,
      };

      const digest = await reviewSubmission(payload);
      await refetch();

      setTxDigest(digest);

      if (approved) {
        toast.success("Submission approved!");
        setReview("Approval");
      } else {
        toast.success("Submission rejected!");
        setReview("Rejection");
      }

      setShowReceipt(true);
      onReviewed?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to review submission.");
    } finally {
      setActiveAction(null);
      setShowApproveDialog(false);
      setShowRejectDialog(false);
    }
  };

  const confirmApprove = () => handleReview(true);
  const confirmReject = () => handleReview(false);

  const isApprovePending = activeAction === "approve" && isSubmitting;
  const isRejectPending = activeAction === "reject" && isSubmitting;

  return (
    <Card className="hover-elevate transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              {/* <AvatarImage src={submission.contributorAvatar} />
              <AvatarFallback>{submission.contributorName[0]}</AvatarFallback> */}
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base line-clamp-1">
                  {submission.project.title}
                </h3>
                <Badge className={config.className}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              {/* <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{submission.description}</p> */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {/* <span className="font-medium">{submission.contributorName}</span> */}
                <span>•</span>
                <span>{submission.contributor}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Submitted {getDate(submission.submittedAt)}</span>
            {/* {submission.previewDatasetSize && (
              <span>Preview: {submission.previewDatasetSize}</span>
            )} */}
          </div>
          <div className="font-semibold text-primary">{rewardLabel}</div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails(submission)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {submission.status === "PENDING" && (
            <>
              <Button
                variant="default"
                size="sm"
                className="flex-1 sm:flex-initial"
                onClick={() => setShowApproveDialog(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1 sm:flex-initial"
                onClick={() => setShowRejectDialog(true)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </>
          )}
          {/* {submission.status === "APPROVED" && submission.fullDatasetUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-initial"
              onClick={() => window.open(submission.fullDatasetUrl, "_blank")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Full Dataset
            </Button>
          )} */}
        </div>

        {/* {submission.status === "REJECTED" && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-400">
              <span className="font-semibold">Rejection reason:</span> {submission.rejectedReason}
            </p>
          </div>
        )} */}
      </CardContent>
      <ApproveSubmissionDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        rewardLabel={rewardLabel}
        onConfirm={confirmApprove}
        isSubmitting={isApprovePending}
      />

      <RejectSubmissionDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={confirmReject}
        isSubmitting={isRejectPending}
      />

      <ReceiptModal
        open={showReceipt}
        onOpenChange={setShowReceipt}
        header={`${review} Success!`}
        description="Your dataset is stored on Walrus and registered on Sui blockchain."
        itemName={submission.project.title}
        type="submission"
        time={Date.now()}
        withSui={txDigest}
        withSmartContract={vanalisPackageId}
      />
    </Card>
  );
}
