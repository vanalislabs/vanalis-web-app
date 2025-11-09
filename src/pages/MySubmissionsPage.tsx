import { Link } from "react-router";
import { ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MySubmissionsPage() {
  //todo: remove mock functionality
  const submissions = [
    {
      id: "1",
      projectId: "proj-1",
      projectName: "Medical Image Dataset Collection",
      status: "verified" as const,
      submittedAt: "2 days ago",
      verifiedAt: "1 day ago",
      reward: "5 SUI",
    },
    {
      id: "2",
      projectId: "proj-2",
      projectName: "NLP Dataset Collection",
      status: "pending" as const,
      submittedAt: "5 hours ago",
      reward: "3 SUI",
    },
    {
      id: "3",
      projectId: "proj-1",
      projectName: "Medical Image Dataset Collection",
      status: "verified" as const,
      submittedAt: "3 days ago",
      verifiedAt: "2 days ago",
      reward: "5 SUI",
    },
    {
      id: "4",
      projectId: "proj-3",
      projectName: "Computer Vision Training Data",
      status: "rejected" as const,
      submittedAt: "1 week ago",
      rejectedAt: "6 days ago",
      reason: "Image quality below requirements",
    },
    {
      id: "5",
      projectId: "proj-2",
      projectName: "NLP Dataset Collection",
      status: "pending" as const,
      submittedAt: "1 day ago",
      reward: "3 SUI",
    },
  ];

  const statusConfig = {
    verified: {
      label: "Verified",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      icon: CheckCircle,
    },
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      icon: Clock,
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      icon: XCircle,
    },
  };

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Submissions</h1>
          <p className="text-muted-foreground">Track your data contributions and earnings</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all">All ({submissions.length})</TabsTrigger>
            <TabsTrigger value="verified" data-testid="tab-verified">Verified ({submissions.filter(s => s.status === 'verified').length})</TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">Pending ({submissions.filter(s => s.status === 'pending').length})</TabsTrigger>
            <TabsTrigger value="rejected" data-testid="tab-rejected">Rejected ({submissions.filter(s => s.status === 'rejected').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {submissions.map((submission) => {
                const StatusIcon = statusConfig[submission.status].icon;
                return (
                  <Card key={submission.id} data-testid={`submission-${submission.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{submission.projectName}</h3>
                            <Badge className={statusConfig[submission.status].className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[submission.status].label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Submitted {submission.submittedAt}</span>
                            {submission.verifiedAt && <span>Verified {submission.verifiedAt}</span>}
                            {submission.rejectedAt && <span>Rejected {submission.rejectedAt}</span>}
                          </div>
                        </div>
                        {submission.reward && (
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Reward</div>
                            <div className="text-lg font-bold text-primary">{submission.reward}</div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {submission.reason && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                          <p className="text-sm text-destructive">{submission.reason}</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Link to={`/projects/${submission.projectId}`}>
                          <Button variant="outline" size="sm" data-testid={`button-view-project-${submission.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Project
                          </Button>
                        </Link>
                        {submission.status === "rejected" && (
                          <Button size="sm" data-testid={`button-resubmit-${submission.id}`}>
                            Resubmit
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="verified" className="mt-6">
            <div className="space-y-4">
              {submissions.filter(s => s.status === 'verified').map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{submission.projectName}</h3>
                          <Badge className={statusConfig.verified.className}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Verified {submission.verifiedAt}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Reward</div>
                        <div className="text-lg font-bold text-primary">{submission.reward}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link to={`/projects/${submission.projectId}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <div className="space-y-4">
              {submissions.filter(s => s.status === 'pending').map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{submission.projectName}</h3>
                          <Badge className={statusConfig.pending.className}>
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Submitted {submission.submittedAt}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Expected Reward</div>
                        <div className="text-lg font-bold text-muted-foreground">{submission.reward}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link to={`/projects/${submission.projectId}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="mt-6">
            <div className="space-y-4">
              {submissions.filter(s => s.status === 'rejected').map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{submission.projectName}</h3>
                          <Badge className={statusConfig.rejected.className}>
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejected
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rejected {submission.rejectedAt}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {submission.reason && (
                      <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p className="text-sm text-destructive">{submission.reason}</p>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Link to={`/projects/${submission.projectId}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Project
                        </Button>
                      </Link>
                      <Button size="sm">Resubmit</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
