import { useState } from "react";
import { CheckCircle, XCircle, Calendar, User, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PreviewDatasetViewer } from "@/components/PreviewDatasetViewer";
import { Submission } from "@/components/SubmissionCard";
import { statusConfig } from "@/constants/submissionStatus";
import { formatRelativeTime } from "@/utils/dateUtils";

interface SubmissionDetailDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (submission: Submission) => void;
  onReject: (submission: Submission, reason: string) => void;
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
  const [rejectReason, setRejectReason] = useState("");

  if (!submission) return null;

  const handleApproveClick = () => {
    setShowApproveConfirm(true);
  };

  const handleApproveConfirm = () => {
    onApprove(submission);
    setShowApproveConfirm(false);
    onOpenChange(false);
  };

  const handleRejectClick = () => {
    setRejectReason("");
    setShowRejectDialog(true);
  };

  const handleRejectConfirm = () => {
    if (rejectReason.trim()) {
      onReject(submission, rejectReason.trim());
      setShowRejectDialog(false);
      setRejectReason("");
      onOpenChange(false);
    }
  };

  const status = statusConfig[submission.status];
  const StatusIcon = status.icon;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl mb-2">{submission.title}</DialogTitle>
                <DialogDescription className="text-base">{submission.description}</DialogDescription>
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
                <AvatarImage src={submission.contributorAvatar} />
                <AvatarFallback>{submission.contributorName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">{submission.contributorName}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="h-3 w-3" />
                  {submission.contributorAddress}
                </div>
              </div>
            </div>

            {/* Tags */}
            {submission.tags && submission.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {submission.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Timeline</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Submitted: {formatRelativeTime(submission.submittedAt)}</span>
                </div>
                {submission.reviewedAt && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Reviewed: {formatRelativeTime(submission.reviewedAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Reason */}
            {submission.status === "rejected" && submission.rejectedReason && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Rejection Reason</h4>
                <p className="text-sm text-red-600 dark:text-red-300">{submission.rejectedReason}</p>
              </div>
            )}

            {/* Preview Dataset */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Preview Dataset</h4>
              <PreviewDatasetViewer
                previewUrl={submission.previewDatasetUrl}
                previewSize={submission.previewDatasetSize}
              />
            </div>

            {/* Full Dataset (if approved) */}
            {submission.status === "approved" && submission.fullDatasetUrl && (
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
            )}

            {/* Reward Info */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reward Amount</p>
                  <p className="text-lg font-bold text-primary">{submission.reward}</p>
                </div>
                {submission.status === "approved" && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Reward Distributed
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {submission.status === "pending" && (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-initial">
                  Close
                </Button>
                <Button variant="destructive" onClick={handleRejectClick} className="flex-1 sm:flex-initial">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button onClick={handleApproveClick} className="flex-1 sm:flex-initial">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
            {submission.status !== "pending" && (
              <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveConfirm} onOpenChange={setShowApproveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this submission? This will unlock the full dataset and distribute the
              reward of {submission.reward} to the contributor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveConfirm}>Approve</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog with Reason Input */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Submission?</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this submission. This will be visible to the contributor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter the reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectReason("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectConfirm}
              disabled={!rejectReason.trim()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Reject Submission
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

