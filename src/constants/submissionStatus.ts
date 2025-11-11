import { Clock, CheckCircle, XCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface StatusConfig {
  label: string;
  icon: LucideIcon;
  className: string;
}

export const statusConfig: Record<SubmissionStatus, StatusConfig> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  approved: {
    label: "Approved",
    icon: CheckCircle,
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

