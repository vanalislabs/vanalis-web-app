export const PROJECT_STATUS = {
    ALL: "ALL",
    OPEN: "OPEN",
    COMPLETED: "COMPLETED",
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const projectStatus = {
  OPEN: {
    label: "Open",
    variant: "default" as const,
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  COMPLETED: {
    label: "Completed",
    variant: "outline" as const,
    className: "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-400",
  },
} as const;
