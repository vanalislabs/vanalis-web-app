import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Loader,
  Download,
  FileText,
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
import { useGetFullDatasetPath } from "@/hooks/useGetFullDatasetPath";
import { useGetPrivateKey } from "@/hooks/useGetPrivateKey";
import { decryptFilePath } from "@/utils/encryption";
import { useGetFullDataset } from "@/hooks/useGetFullDataset";
import { useNetworkVariable } from "@/networkConfig";
import { ReceiptModal } from "./ReceiptModal";
import { set } from "date-fns";
import { useWalrusText } from "@/hooks/useWalrusText";

interface SubmissionDetailDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewed?: () => void;
}

export function SubmissionDetailDialog({
  submission,
  open,
  onOpenChange,
  onReviewed,
}: SubmissionDetailDialogProps) {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [decryptedUrl, setDecryptedUrl] = useState<string | null>("");

  const [showReceipt, setShowReceipt] = useState(false);
  const [txDigest, setTxDigest] = useState("");
  const vanalisPackageId = useNetworkVariable("vanalisPackageId");
  const [review, setReview] = useState("");

  const { data: previewBlobId, error: blobError } = useGetPreviewBlobId(
    submission?.id,
  );

  const { data: fullDatasetPath, error: pathError } = useGetFullDatasetPath(
    submission?.id,
  );

  const fullDatasetPublicKey = submission?.fullDatasetPublicKey;

  const isApproved = submission?.status === "APPROVED";
  const { data: privateKeyData, error: keyError } = useGetPrivateKey(
    isApproved ? fullDatasetPublicKey || "" : "",
  );

  const privateKey = privateKeyData?.data?.privateKey;

  // Always fetch both to get the URL with file extension
  const {
    imageUrl: tempImageUrl,
    isLoading: isLoadingImage,
    error: imageError,
  } = useWalrusImage(previewBlobId);

  const {
    textUrl: tempTextUrl,
    isLoading: isLoadingText,
    error: textError,
  } = useWalrusText(previewBlobId);

  // Determine file type from actual URL extension
  const actualUrl = tempImageUrl || tempTextUrl || "";
  const isText = actualUrl.match(/\.(txt|csv|json|md)$/i) !== null;
  const imageUrl = !isText ? tempImageUrl : null;
  const textUrl = isText ? tempTextUrl : null;

  const { reviewSubmission, isSubmitting } = useReviewSubmission();

  const { data: fullDatasetData, error: fullDatasetError } = useGetFullDataset(
    decryptedUrl || "",
  );
  const fullDataset = fullDatasetData?.data;

  useEffect(() => {
    const loadEncryptedData = async () => {
      if (fullDatasetPath && privateKey) {
        const result = await decryptFilePath(fullDatasetPath, privateKey);
        setDecryptedUrl(result);
      }
    };
    loadEncryptedData();
  }, [fullDatasetPath, privateKey]);

  const { id: projectIdParam } = useParams();

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

      const digest = await reviewSubmission(payload);

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
    },
    [onReviewed, projectIdParam, reviewSubmission, submission],
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
  if (!submission || blobError || pathError || keyError || fullDatasetError)
    return null;

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
              {(isLoadingImage || isLoadingText) && (
                <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg">
                  <Loader className="animate-spin w-7" />
                </div>
              )}
              {imageError && !isText && (
                <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load preview image
                  </p>
                </div>
              )}
              {textError && isText && (
                <div className="flex items-center justify-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Failed to load preview file
                  </p>
                </div>
              )}
              {!isText && imageUrl && (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={imageUrl}
                    alt="Preview dataset"
                    className="w-full h-auto object-contain max-h-96"
                  />
                </div>
              )}
              {isText && textUrl && (
                <div className="rounded-lg overflow-hidden border border-border p-6 bg-muted/30">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Text file preview
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`${textUrl}`, "_blank")}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Preview
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Full Dataset (if approved) */}
            {submission.status === "APPROVED" && (
              <div>
                <h4 className="text-sm font-semibold mb-3">Full Dataset</h4>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">
                        Full dataset unlocked
                      </p>
                    </div>

                    {fullDataset ? (
                      <a
                        href={fullDataset}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex"
                      >
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </a>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        {privateKey ? (
                          <>
                            <Loader className="h-3 w-3 mr-2 animate-spin" />
                            Decrypting...
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 mr-2" />
                            Key Missing
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

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
    </>
  );
}
