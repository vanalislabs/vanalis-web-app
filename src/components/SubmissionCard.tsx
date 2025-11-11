import { CheckCircle, XCircle, Eye, Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { statusConfig } from "@/constants/submissionStatus";

export interface Submission {
  id: string;
  projectId: string;
  contributorName: string;
  contributorAddress: string;
  contributorAvatar?: string;
  title: string;
  description: string;
  tags?: string[];
  status: "pending" | "approved" | "rejected";
  previewDatasetUrl: string;
  fullDatasetUrl?: string;
  previewDatasetSize?: string;
  fullDatasetSize?: string;
  submittedAt: string;
  reviewedAt?: string;
  rejectedReason?: string;
  reward: string;
}

interface SubmissionCardProps {
  submission: Submission;
  onViewDetails: (submission: Submission) => void;
  onApprove?: (submission: Submission) => void;
  onReject?: (submission: Submission) => void;
}

export function SubmissionCard({ submission, onViewDetails, onApprove, onReject }: SubmissionCardProps) {
  const status = statusConfig[submission.status];
  const StatusIcon = status.icon;

  return (
    <Card className="hover-elevate transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={submission.contributorAvatar} />
              <AvatarFallback>{submission.contributorName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base line-clamp-1">{submission.title}</h3>
                <Badge className={status.className}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{submission.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">{submission.contributorName}</span>
                <span>•</span>
                <span>{submission.contributorAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>Submitted {submission.submittedAt}</span>
            {submission.previewDatasetSize && (
              <span>Preview: {submission.previewDatasetSize}</span>
            )}
          </div>
          <div className="font-semibold text-primary">{submission.reward}</div>
        </div>

        {submission.tags && submission.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {submission.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

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
          {submission.status === "pending" && (
            <>
              {onApprove && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1 sm:flex-initial"
                  onClick={() => onApprove(submission)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
              {onReject && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1 sm:flex-initial"
                  onClick={() => onReject(submission)}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
            </>
          )}
          {submission.status === "approved" && submission.fullDatasetUrl && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-initial"
              onClick={() => window.open(submission.fullDatasetUrl, "_blank")}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Full Dataset
            </Button>
          )}
        </div>

        {submission.status === "rejected" && submission.rejectedReason && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-400">
              <span className="font-semibold">Rejection reason:</span> {submission.rejectedReason}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

