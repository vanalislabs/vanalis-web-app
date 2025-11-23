import { ArrowRight, TrendingUp, Users, Database } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { DatasetCard } from "@/components/DatasetCard";
import { StatsCard } from "@/components/StatsCard";
import { LeaderboardItem } from "@/components/LeaderboardItem";
import { ActivityFeedItem } from "@/components/ActivityFeedItem";
import datasetImage from "@assets/dummy/AI_dataset_visualization_thumbnail_8ab46a36.png";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";
import { useGetProjectFeatured } from "@/hooks/project/useGetProjectFeatured";
import Loading from "@/loading";

export default function HomePage() {

  const {data, isLoading, error} = useGetProjectFeatured();

  if(isLoading){
      return <Loading />
    }
  
    if (error) {
      return (
        <div className="flex items-center justify-center py-8">
          <p className="text-red-500">Failed to load projects</p>
        </div>
      );
    }

  const featuredDatasets = [
    {
      id: "1",
      name: "Curated Medical Imaging - X-Ray Collection",
      image: datasetImage,
      price: "250",
      itemsCount: 5000,
      category: "Healthcare",
      sourceProjectId: "proj-1",
      sourceProjectName: "Medical Image Collection",
    },
    {
      id: "2",
      name: "Multilingual Text Dataset",
      image: datasetImage,
      price: "180",
      itemsCount: 25000,
      category: "NLP",
    },
    {
      id: "3",
      name: "Autonomous Driving Scenarios",
      image: datasetImage,
      price: "420",
      itemsCount: 15000,
      category: "Computer Vision",
    },
    {
      id: "4",
      name: "Speech Recognition Audio Dataset",
      image: datasetImage,
      price: "300",
      itemsCount: 10000,
      category: "Audio",
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome to Vanalis</h1>
            <p className="text-muted-foreground mt-2">Crowdsource, curate, and trade AI datasets on blockchain. Fair rewards, transparent ownership, powered by Sui.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard title="Total Datasets" value="1,234" icon={Database} change="+12% this month" changeType="positive" />
            <StatsCard title="Active Projects" value="87" icon={TrendingUp} change="+5 new" changeType="positive" />
            <StatsCard title="Contributors" value="12.5K" icon={Users} change="+2.3K this week" changeType="positive" />
            <StatsCard title="Total Volume" value="$2.4M" icon={Database} change="+18%" changeType="positive" />
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Projects</h2>
              <p className="text-muted-foreground mt-2">Active crowdsourcing projects collecting data</p>
            </div>
            <Link to="/projects">
              <Button variant="ghost" data-testid="link-view-all-projects">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Datasets</h2>
              <p className="text-muted-foreground mt-2">Ready-to-use curated datasets for AI training</p>
            </div>
            <Link to="/marketplace">
              <Button variant="ghost" data-testid="link-view-all-datasets">
                View Marketplace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDatasets.map((dataset) => (
              <DatasetCard key={dataset.id} {...dataset} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Leaderboards</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Top Contributors</h3>
              <div className="space-y-2">
                <LeaderboardItem rank={1} user="alice.sui" userAvatar={avatarImage} metric="Total Contributions" metricValue="1,245" badge="Top Contributor" />
                <LeaderboardItem rank={2} user="bob.sui" metric="Total Contributions" metricValue="986" />
                <LeaderboardItem rank={3} user="carol.sui" metric="Total Contributions" metricValue="756" />
                <LeaderboardItem rank={4} user="david.sui" metric="Total Contributions" metricValue="623" />
                <LeaderboardItem rank={5} user="eve.sui" metric="Total Contributions" metricValue="589" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Top Curators</h3>
              <div className="space-y-2">
                <LeaderboardItem rank={1} user="curator1.sui" userAvatar={avatarImage} metric="Datasets Created" metricValue="24" badge="Top Curator" />
                <LeaderboardItem rank={2} user="curator2.sui" metric="Datasets Created" metricValue="18" />
                <LeaderboardItem rank={3} user="curator3.sui" metric="Datasets Created" metricValue="15" />
                <LeaderboardItem rank={4} user="curator4.sui" metric="Datasets Created" metricValue="12" />
                <LeaderboardItem rank={5} user="curator5.sui" metric="Datasets Created" metricValue="10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Recent Activity</h2>
            <Link to="/activity">
              <Button variant="ghost" data-testid="link-view-all-activity">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="space-y-2">
            <ActivityFeedItem type="submission" user="alice.sui" userAvatar={avatarImage} action="submitted to" target="Medical Image Dataset Collection" timestamp="2 hours ago" />
            <ActivityFeedItem type="purchase" user="bob.sui" action="purchased" target="AI Training Dataset - Natural Language" timestamp="5 hours ago" amount="150 SUI" />
            <ActivityFeedItem type="verification" user="curator1.sui" action="verified" target="Computer Vision Training Data submission" timestamp="8 hours ago" />
            <ActivityFeedItem type="reward" user="carol.sui" action="earned reward from" target="Medical Image Dataset Collection" timestamp="1 day ago" amount="50 SUI" />
            <ActivityFeedItem type="submission" user="david.sui" action="submitted to" target="NLP Dataset Collection" timestamp="1 day ago" />
          </div>
        </div>
      </section>
    </div>
  );
}
