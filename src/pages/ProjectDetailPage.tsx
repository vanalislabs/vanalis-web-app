import { Link, useParams } from "react-router";
import { Calendar, Users, DollarSign, Upload, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeaderboardItem } from "@/components/LeaderboardItem";
import { ActivityFeedItem } from "@/components/ActivityFeedItem";
import projectImage from "@assets/dummy/Team_data_collection_illustration_dd59af91.png";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const projectId = id;

  //todo: remove mock functionality
  const project = {
    id: projectId,
    title: "Medical Image Dataset Collection",
    description: "We are collecting high-quality medical imaging data for training AI models in healthcare diagnostics. Contributors will submit X-ray images with proper annotations and metadata. All data will be verified by medical professionals before being included in the final dataset.",
    image: projectImage,
    status: "open" as "open" | "closing-soon" | "completed",
    reward: "5,000 SUI",
    rewardPerSubmission: "5 SUI",
    deadline: "30 days",
    submissions: 245,
    verified: 180,
    goal: 1000,
    curatorName: "Dr. Sarah Chen",
    curatorAvatar: avatarImage,
    curatorAddress: "0x7a3f...9d2e",
    category: "Healthcare",
    requirements: [
      "X-ray images in DICOM or PNG format",
      "Minimum resolution: 1024x1024 pixels",
      "Proper anatomical region labeling",
      "Patient privacy compliance (anonymized)",
      "Medical professional verification preferred"
    ],
    createdAt: "2 weeks ago",
    completionPercentage: 24.5,
  };

  const topContributors = [
    { rank: 1, user: "alice.sui", userAvatar: avatarImage, metric: "Submissions", metricValue: "45", badge: "Top Contributor" },
    { rank: 2, user: "bob.sui", metric: "Submissions", metricValue: "38" },
    { rank: 3, user: "carol.sui", metric: "Submissions", metricValue: "32" },
  ];

  const statusConfig = {
    open: { label: "Open", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    "closing-soon": { label: "Closing Soon", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
    completed: { label: "Completed", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
  };

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{project.title}</h1>
                    <Badge className={statusConfig[project.status].className}>
                      {statusConfig[project.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Badge variant="outline">{project.category}</Badge>
                    <span>Created {project.createdAt}</span>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="about" className="w-full">
                <TabsList>
                  <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
                  <TabsTrigger value="requirements" data-testid="tab-requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold mb-3">Project Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="requirements" className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Submission Requirements</h3>
                  <ul className="space-y-3">
                    {project.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>

                <TabsContent value="activity" className="mt-6">
                  <div className="space-y-2">
                    <ActivityFeedItem type="submission" user="alice.sui" userAvatar={avatarImage} action="submitted to" target={project.title} timestamp="2 hours ago" />
                    <ActivityFeedItem type="verification" user={project.curatorName} action="verified" target="New submission" timestamp="3 hours ago" />
                    <ActivityFeedItem type="submission" user="bob.sui" action="submitted to" target={project.title} timestamp="5 hours ago" />
                    <ActivityFeedItem type="reward" user="carol.sui" action="earned reward from" target={project.title} timestamp="8 hours ago" amount="5 SUI" />
                  </div>
                </TabsContent>
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
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-semibold">{project.completionPercentage}%</span>
                  </div>
                  <Progress value={project.completionPercentage} className="h-2 mb-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{project.submissions} submissions</span>
                    <span className="text-muted-foreground">{project.goal} goal</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Total Reward Pool</div>
                      <div className="font-semibold">{project.reward}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Per Submission</div>
                      <div className="font-semibold">{project.rewardPerSubmission}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Deadline</div>
                      <div className="font-semibold">{project.deadline}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Verified</div>
                      <div className="font-semibold">{project.verified} items</div>
                    </div>
                  </div>
                </div>

                {project.status === "open" && (
                  <Link to={`/projects/${project.id}/submit`}>
                    <Button className="w-full" size="lg" data-testid="button-submit-data">
                      <Upload className="mr-2 h-5 w-5" />
                      Submit Data
                    </Button>
                  </Link>
                )}

                {project.status === "completed" && (
                  <Link to={`/marketplace/${project.id}`}>
                    <Button className="w-full" size="lg" data-testid="button-view-dataset">
                      View Dataset
                    </Button>
                  </Link>
                )}

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={project.curatorAvatar} />
                      <AvatarFallback>{project.curatorName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xs text-muted-foreground">Curator</div>
                      <div className="font-medium">{project.curatorName}</div>
                      <div className="text-xs text-muted-foreground">{project.curatorAddress}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
