import { Link } from "react-router";
import { ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetMySubmissions } from "@/hooks/submission/useGetMySubmissions";
import { submissionStatus } from "@/constants/submissionStatus";
import { getDate } from "@/lib/convertDate";

export default function MySubmissionsPage() {
  const {data: submissions, isLoading, error} = useGetMySubmissions();

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
            <TabsTrigger value="verified" data-testid="tab-verified">Verified ({submissions.filter(s => s.status === 'APPROVED').length})</TabsTrigger>
            <TabsTrigger value="pending" data-testid="tab-pending">Pending ({submissions.filter(s => s.status === 'PENDING').length})</TabsTrigger>
            <TabsTrigger value="rejected" data-testid="tab-rejected">Rejected ({submissions.filter(s => s.status === 'REJECTED').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {submissions.map((submission) => {
                const StatusIcon = submissionStatus[submission.status].icon;
                return (
                  <Card key={submission.id} data-testid={`submission-${submission.id}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{submission.project.title}</h3>
                            <Badge className={submissionStatus[submission.status].className}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {submissionStatus[submission.status].label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Submitted {getDate(submission.submittedAt)}</span>
                            {submission.status === "APPROVED" && <span>Approved {getDate(submission.reviewedAt)}</span>}
                            {submission.status === "REJECTED" && <span>Rejected {getDate(submission.reviewedAt)}</span>}
                          </div>
                        </div>
                        {/* {submission.reward && (
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Reward</div>
                            <div className="text-lg font-bold text-primary">{submission.reward}</div>
                          </div>
                        )} */}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* {submission.reason && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                          <p className="text-sm text-destructive">{submission.reason}</p>
                        </div>
                      )} */}
                      <div className="flex gap-2">
                        <Link to={`/projects/${submission.projectId}`}>
                          <Button variant="outline" size="sm" data-testid={`button-view-project-${submission.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Project
                          </Button>
                        </Link>
                        {submission.status === "REJECTED" && (
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
              {submissions.filter(s => s.status === 'APPROVED').map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{submission.project.title}</h3>
                          <Badge className={submissionStatus.APPROVED.className}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Approved {getDate(submission.reviewedAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Reward</div>
                        {/* <div className="text-lg font-bold text-primary">{submission.reward}</div> */}
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
              {submissions.filter(s => s.status === 'PENDING').map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{submission.project.title}</h3>
                          <Badge className={submissionStatus.PENDING.className}>
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Submitted {getDate(submission.submittedAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Expected Reward</div>
                        {/* <div className="text-lg font-bold text-muted-foreground">{submission.reward}</div> */}
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
              {submissions.filter(s => s.status === 'REJECTED').map((submission) => (
                <Card key={submission.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{submission.project.title}</h3>
                          <Badge className={submissionStatus.REJECTED.className}>
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejected
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rejected {getDate(submission.reviewedAt)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* {submission.reason && (
                      <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                        <p className="text-sm text-destructive">{submission.reason}</p>
                      </div>
                    )} */}
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
