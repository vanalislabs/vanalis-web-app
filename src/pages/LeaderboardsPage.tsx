import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeaderboardItem } from "@/components/LeaderboardItem";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";

export default function LeaderboardsPage() {
  const [timeFilter, setTimeFilter] = useState("all-time");

  //todo: remove mock functionality
  const topContributors = [
    { rank: 1, user: "alice.sui", userAvatar: avatarImage, metric: "Total Contributions", metricValue: "1,245", badge: "Top Contributor" },
    { rank: 2, user: "bob.sui", metric: "Total Contributions", metricValue: "986" },
    { rank: 3, user: "carol.sui", metric: "Total Contributions", metricValue: "756" },
    { rank: 4, user: "david.sui", metric: "Total Contributions", metricValue: "623" },
    { rank: 5, user: "eve.sui", metric: "Total Contributions", metricValue: "589" },
    { rank: 6, user: "frank.sui", metric: "Total Contributions", metricValue: "534" },
    { rank: 7, user: "grace.sui", metric: "Total Contributions", metricValue: "487" },
    { rank: 8, user: "henry.sui", metric: "Total Contributions", metricValue: "445" },
    { rank: 9, user: "iris.sui", metric: "Total Contributions", metricValue: "398" },
    { rank: 10, user: "jack.sui", metric: "Total Contributions", metricValue: "365" },
  ];

  const topCurators = [
    { rank: 1, user: "curator1.sui", userAvatar: avatarImage, metric: "Datasets Created", metricValue: "24", badge: "Top Curator" },
    { rank: 2, user: "curator2.sui", metric: "Datasets Created", metricValue: "18" },
    { rank: 3, user: "curator3.sui", metric: "Datasets Created", metricValue: "15" },
    { rank: 4, user: "curator4.sui", metric: "Datasets Created", metricValue: "12" },
    { rank: 5, user: "curator5.sui", metric: "Datasets Created", metricValue: "10" },
    { rank: 6, user: "curator6.sui", metric: "Datasets Created", metricValue: "9" },
    { rank: 7, user: "curator7.sui", metric: "Datasets Created", metricValue: "7" },
    { rank: 8, user: "curator8.sui", metric: "Datasets Created", metricValue: "6" },
    { rank: 9, user: "curator9.sui", metric: "Datasets Created", metricValue: "5" },
    { rank: 10, user: "curator10.sui", metric: "Datasets Created", metricValue: "4" },
  ];

  const topTrainers = [
    { rank: 1, user: "trainer1.sui", userAvatar: avatarImage, metric: "Datasets Purchased", metricValue: "32", badge: "Top Trainer" },
    { rank: 2, user: "trainer2.sui", metric: "Datasets Purchased", metricValue: "28" },
    { rank: 3, user: "trainer3.sui", metric: "Datasets Purchased", metricValue: "24" },
    { rank: 4, user: "trainer4.sui", metric: "Datasets Purchased", metricValue: "21" },
    { rank: 5, user: "trainer5.sui", metric: "Datasets Purchased", metricValue: "18" },
    { rank: 6, user: "trainer6.sui", metric: "Datasets Purchased", metricValue: "15" },
    { rank: 7, user: "trainer7.sui", metric: "Datasets Purchased", metricValue: "13" },
    { rank: 8, user: "trainer8.sui", metric: "Datasets Purchased", metricValue: "11" },
    { rank: 9, user: "trainer9.sui", metric: "Datasets Purchased", metricValue: "9" },
    { rank: 10, user: "trainer10.sui", metric: "Datasets Purchased", metricValue: "7" },
  ];

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Leaderboards</h1>
              <p className="text-muted-foreground">Top performers in the DataVault ecosystem</p>
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-40" data-testid="select-time-filter">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="contributors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contributors" data-testid="tab-contributors">Contributors</TabsTrigger>
            <TabsTrigger value="curators" data-testid="tab-curators">Curators</TabsTrigger>
            <TabsTrigger value="trainers" data-testid="tab-trainers">Trainers</TabsTrigger>
          </TabsList>

          <TabsContent value="contributors" className="mt-6">
            <div className="space-y-2">
              {topContributors.map((contributor) => (
                <LeaderboardItem key={contributor.rank} {...contributor} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="curators" className="mt-6">
            <div className="space-y-2">
              {topCurators.map((curator) => (
                <LeaderboardItem key={curator.rank} {...curator} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trainers" className="mt-6">
            <div className="space-y-2">
              {topTrainers.map((trainer) => (
                <LeaderboardItem key={trainer.rank} {...trainer} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
