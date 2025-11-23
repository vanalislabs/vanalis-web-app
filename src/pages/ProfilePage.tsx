import { useParams } from "react-router";
import { TrendingUp, Award, Database, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/StatsCard";
import { ProjectCard } from "@/components/ProjectCard";
import { DatasetCard } from "@/components/DatasetCard";
import { ActivityFeedItem } from "@/components/ActivityFeedItem";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";
import projectImage from "@assets/dummy/Team_data_collection_illustration_dd59af91.png";
import datasetImage from "@assets/dummy/AI_dataset_visualization_thumbnail_8ab46a36.png";

export default function ProfilePage() {
  const { address } = useParams();

  //todo: remove mock functionality
  const profile = {
    address: address || "",
    username: "alice.sui",
    avatar: avatarImage,
    bio: "AI/ML enthusiast and data contributor. Passionate about healthcare AI and medical imaging datasets.",
    joinedDate: "3 months ago",
    stats: {
      contributions: 1245,
      projectsCreated: 3,
      datasetsOwned: 2,
      totalEarnings: "3,450 SUI",
    },
  };

  const projects = [
    {
      id: "1",
      title: "Medical Image Dataset Collection",
      imageUrl: projectImage,
      status: "OPEN" as const,
      rewardPool: 5000,
      deadline: 1764028800000,
      approvedCount: 245,
      targetSubmissions: 1000,
      curatorName: profile.username,
      curatorAvatar: profile.avatar,
    },
  ];

  const datasets = [
    {
      id: "1",
      name: "Healthcare Dataset - Patient Records",
      image: datasetImage,
      price: "200",
      itemsCount: 3000,
      category: "Healthcare",
    },
  ];

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full">
        <Card className="mb-8">
          <CardContent className="py-8">
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback>{profile.username[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profile.username}</h1>
                </div>
                <p className="text-muted-foreground mb-2">{profile.address}</p>
                <p className="text-foreground mb-4">{profile.bio}</p>
                <p className="text-sm text-muted-foreground">Joined {profile.joinedDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard title="Contributions" value={profile.stats.contributions} icon={Upload} />
          <StatsCard title="Projects Created" value={profile.stats.projectsCreated} icon={Award} />
          <StatsCard title="Datasets" value={profile.stats.datasetsOwned} icon={Database} />
          <StatsCard title="Total Earnings" value={profile.stats.totalEarnings} icon={TrendingUp} />
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList>
            <TabsTrigger value="projects" data-testid="tab-projects">Projects Created ({projects.length})</TabsTrigger>
            <TabsTrigger value="datasets" data-testid="tab-datasets">Datasets ({datasets.length})</TabsTrigger>
            <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground">No projects created yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="datasets" className="mt-6">
            {datasets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {datasets.map((dataset) => (
                  <DatasetCard key={dataset.id} {...dataset} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground">No datasets published yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <ActivityFeedItem type="submission" user={profile.username} userAvatar={profile.avatar} action="submitted to" target="Medical Image Dataset Collection" timestamp="2 hours ago" />
                  <ActivityFeedItem type="verification" user={profile.username} userAvatar={profile.avatar} action="verified" target="New submission in NLP Dataset" timestamp="1 day ago" />
                  <ActivityFeedItem type="reward" user={profile.username} userAvatar={profile.avatar} action="earned reward from" target="Computer Vision Data" timestamp="3 days ago" amount="50 SUI" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
