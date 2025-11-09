import { DollarSign, TrendingUp, Users, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EarningsPage() {
  //todo: remove mock functionality
  const transactions = [
    { id: "1", type: "Contributor", project: "Medical Image Dataset", amount: "50 SUI", date: "2 days ago", status: "completed" },
    { id: "2", type: "Curator", project: "NLP Dataset Sales", amount: "120 SUI", date: "5 days ago", status: "completed" },
    { id: "3", type: "Contributor", project: "Computer Vision Data", amount: "35 SUI", date: "1 week ago", status: "completed" },
    { id: "4", type: "Curator", project: "Audio Dataset Sales", amount: "90 SUI", date: "2 weeks ago", status: "completed" },
    { id: "5", type: "Contributor", project: "Medical Image Dataset", amount: "50 SUI", date: "3 weeks ago", status: "completed" },
  ];

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Earnings</h1>
          <p className="text-muted-foreground">Track your earnings and transaction history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Total Earnings" value="2,450 SUI" icon={DollarSign} change="+12% this month" changeType="positive" />
          <StatsCard title="Contributor" value="1,225 SUI" icon={Users} change="50% share" changeType="neutral" />
          <StatsCard title="Curator" value="735 SUI" icon={Award} change="30% share" changeType="neutral" />
          <StatsCard title="This Month" value="345 SUI" icon={TrendingUp} change="+18%" changeType="positive" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Earnings Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium">Contributor (50%)</span>
                    <p className="text-xs text-muted-foreground">Rewards from data submissions</p>
                  </div>
                  <span className="text-lg font-bold text-primary">1,225 SUI</span>
                </div>
                <Progress value={50} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium">Curator (30%)</span>
                    <p className="text-xs text-muted-foreground">Dataset sales royalties</p>
                  </div>
                  <span className="text-lg font-bold text-primary">735 SUI</span>
                </div>
                <Progress value={30} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium">Platform (20%)</span>
                    <p className="text-xs text-muted-foreground">Platform fees</p>
                  </div>
                  <span className="text-lg font-bold text-muted-foreground">490 SUI</span>
                </div>
                <Progress value={20} className="h-3" />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Earnings</span>
                  <span className="text-2xl font-bold text-primary">2,450 SUI</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" data-testid="button-withdraw">
                <DollarSign className="mr-2 h-4 w-4" />
                Withdraw Earnings
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-export">
                Export History
              </Button>
              <div className="pt-4 border-t border-border">
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-medium">2,450 SUI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="font-medium">125 SUI</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover-elevate" data-testid={`transaction-${tx.id}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <Badge variant="secondary">{tx.type}</Badge>
                      <span className="font-medium">{tx.project}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{tx.amount}</div>
                    <Badge variant="outline" className="text-xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <Button variant="outline" data-testid="button-load-more">Load More</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
