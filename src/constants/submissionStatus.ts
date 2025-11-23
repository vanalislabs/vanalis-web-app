import { Clock, CheckCircle, XCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

// export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

// export interface StatusConfig {
//   label: string;
//   icon: LucideIcon;
//   className: string;
// }

export const SUBMISSION_STATUS = {
    ALL: "ALL",
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
} as const;

export type SubmissionStatus = (typeof SUBMISSION_STATUS)[keyof typeof SUBMISSION_STATUS];

export const submissionStatus = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle,
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

