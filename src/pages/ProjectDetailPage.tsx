import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import {
  Calendar,
  DollarSign,
  Upload,
  CheckCircle,
  Clock,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LeaderboardItem } from "@/components/LeaderboardItem";
import { ActivityFeedItem } from "@/components/ActivityFeedItem";
import { SubmissionCard } from "@/components/SubmissionCard";
import { Submission } from "@/types/submission";
import { SubmissionDetailDialog } from "@/components/SubmissionDetailDialog";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import Loading from "@/loading";
import { projectStatus } from "@/constants/projectStatus";
import { ProjectEvent } from "@/types/project";
import { getDate, getDaysRemaining } from "@/lib/convertDate";
import { formattedSui } from "@/lib/convertDecimals";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const projectId = id ?? "";

  const account = useCurrentAccount();
  
  const {
    data,
    isLoading,
    error,
    refetch: refetchProject,
  } = useGetProjectById(projectId);
  
  const project = (data?.data as ProjectEvent) ?? undefined;
  const isProjectOwner = 
    account?.address && 
    project?.curator && 
    account.address === project.curator;

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  // Filter submissions based on status
  const normalizeStatus = (status: Submission["status"]) =>
    status?.toLowerCase() as "pending" | "approved" | "rejected";

  const projectSubmissions = project?.submissions ?? [];

  const filteredSubmissions = projectSubmissions.filter((sub) => {
    if (statusFilter === "all") return true;
    return normalizeStatus(sub.status) === statusFilter;
  });

  // Calculate submission counts
  const submissionCounts = useMemo(
    () =>
      projectSubmissions.reduce(
        (acc, submission) => {
          const normalized = normalizeStatus(submission.status);
          acc[normalized] += 1;
          acc.total += 1;
          return acc;
        },
        { pending: 0, approved: 0, rejected: 0, total: 0 },
      ),
    [projectSubmissions],
  );
  // Handlers
  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsDetailDialogOpen(true);
  };
  const topContributors = [
    {
      rank: 1,
      user: "alice.sui",
      userAvatar: avatarImage,
      metric: "Submissions",
      metricValue: "45",
      badge: "Top Contributor",
    },
    { rank: 2, user: "bob.sui", metric: "Submissions", metricValue: "38" },
    { rank: 3, user: "carol.sui", metric: "Submissions", metricValue: "32" },
  ];

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">Project not found</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">Project not found</p>
      </div>
    );
  }

  const statusKey = project.status as keyof typeof projectStatus;
  const config = projectStatus[statusKey] ?? {
    label: "Unknown",
    className: "bg-gray-400",
  };

  const progress = project.targetSubmissions
    ? Number(
        Math.min(
          100,
          (project.approvedCount / project.targetSubmissions) * 100,
        ),
      ).toFixed(2)
    : 0;
  if (!project.rewardPool || !project.deadline) {
    return null;
  }

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{project.title}</h1>
                    <Badge className={config.className}>{config.label}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline">{project.category}</Badge>
                    <span>Created {getDate(project.createdAt)}</span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="about" className="w-full">
                <TabsList>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  {isProjectOwner && (
                    <TabsTrigger value="submissions">
                      Submissions ({submissionCounts.total})
                    </TabsTrigger>
                  )}
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold mb-3">
                      Project Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Submission Requirements
                  </h3>
                  <ul className="space-y-3">
                    {project.submissionRequirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <div className="space-y-2">
                    <ActivityFeedItem
                      type="submission"
                      user="alice.sui"
                      userAvatar={avatarImage}
                      action="submitted to"
                      target={project.title}
                      timestamp="2 hours ago"
                    />
                    <ActivityFeedItem
                      type="verification"
                      user={project.curator}
                      action="verified"
                      target="New submission"
                      timestamp="3 hours ago"
                    />
                    <ActivityFeedItem
                      type="submission"
                      user="bob.sui"
                      action="submitted to"
                      target={project.title}
                      timestamp="5 hours ago"
                    />
                    <ActivityFeedItem
                      type="reward"
                      user="carol.sui"
                      action="earned reward from"
                      target={project.title}
                      timestamp="8 hours ago"
                      amount="5 SUI"
                    />
                  </div>
                </TabsContent>

                {isProjectOwner && (
                  <TabsContent value="submissions" className="mt-6">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold">
                          Submissions Review
                        </h3>
                        <Select
                          value={statusFilter}
                          onValueChange={(value) =>
                            setStatusFilter(value as typeof statusFilter)
                          }
                        >
                          <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Submissions</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {filteredSubmissions.length === 0 ? (
                        <Card>
                          <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                              No submissions found for the selected filter.
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {filteredSubmissions.map((submission) => (
                            <SubmissionCard
                              key={submission.id}
                              submissionId={submission.id}
                              onViewDetails={handleViewDetails}
                              onReviewed={refetchProject}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                )}
              </Tabs>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topContributors.map((contributor) => (
                    <LeaderboardItem key={contributor.rank} {...contributor} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Project Stats</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Progress
                    </span>
                    <span className="text-sm font-semibold">{progress}%</span>
                  </div>
                  <Progress value={Number(progress)} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {project.approvedCount}/{project.targetSubmissions}{" "}
                      submissions
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Total Reward Pool
                      </div>
                      <div className="font-semibold">
                        {formattedSui(project.rewardPool)} SUI
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Per Submission
                      </div>
                      <div className="font-semibold">
                        {formattedSui(
                          project.rewardPool,
                          project.targetSubmissions,
                        )}{" "}
                        SUI
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Deadline
                      </div>
                      <div className="font-semibold">
                        {getDaysRemaining(project.deadline)} days
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Approved
                      </div>
                      <div className="font-semibold">
                        {project.approvedCount} items
                      </div>
                    </div>
                  </div>

                  {isProjectOwner && (
                    <>
                      <div className="pt-3 border-t border-border">
                        <div className="text-xs font-semibold text-muted-foreground mb-2">
                          Submissions
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                              <span className="text-xs text-muted-foreground">
                                Pending
                              </span>
                            </div>
                            <span className="font-semibold">
                              {submissionCounts.pending}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                              <span className="text-xs text-muted-foreground">
                                Approved
                              </span>
                            </div>
                            <span className="font-semibold">
                              {submissionCounts.approved}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                              <span className="text-xs text-muted-foreground">
                                Rejected
                              </span>
                            </div>
                            <span className="font-semibold">
                              {submissionCounts.rejected}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {project.status === "OPEN" && !isProjectOwner && (
                  <Link to={`/projects/${project.id}/submit`}>
                    <Button className="w-full" size="lg">
                      <Upload className="mr-2 h-5 w-5" />
                      Submit Data
                    </Button>
                  </Link>
                )}

                {project.status === "COMPLETED" && (
                  <Link to={`/marketplace/${project.id}`}>
                    <Button className="w-full" size="lg">
                      View Dataset
                    </Button>
                  </Link>
                )}

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      {/* !TODO */}
                      <AvatarImage src={undefined} />
                      <AvatarFallback>{project.curator}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Curator
                      </div>
                      {/* !TODO name */}
                      {/* <div className="font-medium">{project.curator}</div> */}
                      <div className="text-xs text-muted-foreground">
                        {/* !TODO address */}
                        {/* {project.curator} */}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SubmissionDetailDialog
        submission={selectedSubmission}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        onReviewed={refetchProject}
      />
      
    </div>
  );
}
