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
  targetSubmissions: number;
  createdAt: number;
  deadline: number;
  status: "OPEN" | "COMPLETED" | "closing-soon";
  submissions: Submission[];

  submissionsCount: number;
  approvedCount: number;
};
