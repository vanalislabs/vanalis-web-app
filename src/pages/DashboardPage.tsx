import { DollarSign, Upload, FolderOpen, Database, TrendingUp, Plus } from "lucide-react";
import { Link } from "react-router";
import { StatsCard } from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityFeedItem } from "@/components/ActivityFeedItem";
import { Progress } from "@/components/ui/progress";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";

export default function DashboardPage() {
  //todo: remove mock functionality
  const pendingActions = [
    { title: "Review submission in Medical Image Dataset", project: "Medical Image Dataset", time: "2 hours ago" },
    { title: "Verify new contributor data", project: "NLP Dataset Collection", time: "5 hours ago" },
  ];

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, john.sui</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Earnings" value="2,450 SUI" icon={DollarSign} change="+12% this month" changeType="positive" />
          <StatsCard title="Submissions" value="24" icon={Upload} change="+3 pending" changeType="positive" />
          <StatsCard title="Projects Created" value="5" icon={FolderOpen} />
          <StatsCard title="Datasets Owned" value="8" icon={Database} change="+1 new" changeType="positive" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/projects/create">
              <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-create-project">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Create Project</h3>
                  <p className="text-sm text-muted-foreground">Start a new data collection project</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/projects">
              <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-submit-data">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Submit Data</h3>
                  <p className="text-sm text-muted-foreground">Contribute to active projects</p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/marketplace">
              <Card className="hover-elevate active-elevate-2 cursor-pointer" data-testid="card-browse-marketplace">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Browse Marketplace</h3>
                  <p className="text-sm text-muted-foreground">Find datasets for your AI models</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingActions.length > 0 ? (
                <div className="space-y-4">
                  {pendingActions.map((action, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg hover-elevate" data-testid={`pending-action-${index}`}>
                      <h4 className="font-medium mb-1">{action.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{action.project}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">{action.time}</span>
                        <Button size="sm" data-testid={`button-action-${index}`}>Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No pending actions</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Contributor (50%)</span>
                  <span className="text-sm font-bold">1,225 SUI</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Curator (30%)</span>
                  <span className="text-sm font-bold">735 SUI</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Platform (20%)</span>
                  <span className="text-sm font-bold">490 SUI</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
              <div className="pt-4 border-t border-border">
                <Link to="/earnings">
                  <Button variant="outline" className="w-full" data-testid="button-view-earnings">
                    View Detailed Earnings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <ActivityFeedItem type="submission" user="alice.sui" userAvatar={avatarImage} action="submitted to" target="Medical Image Dataset Collection" timestamp="2 hours ago" />
              <ActivityFeedItem type="purchase" user="bob.sui" action="purchased" target="AI Training Dataset" timestamp="5 hours ago" amount="150 SUI" />
              <ActivityFeedItem type="verification" user="curator1.sui" action="verified" target="Computer Vision Data" timestamp="8 hours ago" />
              <ActivityFeedItem type="reward" user="carol.sui" action="earned reward from" target="NLP Dataset" timestamp="1 day ago" amount="50 SUI" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
