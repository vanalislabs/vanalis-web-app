import { Submission } from "./submission";

export type ProjectEvent = {
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
  createdAt: number;
  deadline: number;
  submissions: Submission[];

  submissionsCount: number;
  approvedCount: number;
};
