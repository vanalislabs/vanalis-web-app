export type Submission = {
  id: string;
  projectId: string;
  contributor: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  rewardPaid: number;
  fullDatasetPublicKey: string;
  submittedAt: number;
  reviewedAt: number;
  project: {
    id: string;
    curator: string;
    title: string;
    description: string;
    submissionRequirements: string[];
    dataType: string;
    category: string;
    imageUrl: string;
    rewardPool: number;
    totalRewardPool: number;
    targetSubmissions: number;
    status: "OPEN" | "COMPLETED";
    submissionsCount: number;
    approvedCount: number;
    rejectedCount: number;
    createdAt: number;
    deadline: number;
  };
};
