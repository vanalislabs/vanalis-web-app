export type ProjectEvent = {
  id: string;
  curator: string;
  title: string;
  description: string;
  submissionRequirements: string[];
  dataType: string;
  category: string;
  imageUrl: string;
  rewardPool: string;
  targetSubmissions: number;
  createdAt: string;
  deadline: number;
  status: "OPEN" | "COMPLETED" | "closing-soon";

  submissionsCount: number;
  approvedCount: number;
};
