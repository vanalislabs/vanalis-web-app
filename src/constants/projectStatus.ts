export const PROJECT_STATUS = {
    ALL: "ALL",
    OPEN: "OPEN",
    COMPLETED: "COMPLETED",
} as const;

export type ProjectStatus = (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];