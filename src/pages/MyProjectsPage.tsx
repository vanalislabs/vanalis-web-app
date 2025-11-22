import { Link } from "react-router";
import { Plus, Settings, Eye, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import projectImage from "@assets/dummy/Team_data_collection_illustration_dd59af91.png";
import { useNetworkVariable } from "@/networkConfig";
import { useEffect, useState } from "react";
import { useSuiClient } from "@mysten/dapp-kit";
import { PaginatedEvents } from "@mysten/sui/client";
import type { ProjectEvent } from "@/types/project";

export default function MyProjectsPage() {
  const vanalisPackageId = useNetworkVariable("vanalisPackageId");
  const EVENT_TYPE = `${vanalisPackageId}::project::ProjectCreatedEvent`;
  const suiClient = useSuiClient();
  const [data, setData] = useState<PaginatedEvents | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsRes = await suiClient.queryEvents({
        query: {
          MoveEventType: EVENT_TYPE,
        },
      });
      if(eventsRes) setData(eventsRes);
      // console.log(eventsRes);
    };
    fetchEvents();
  }, [])
  console.log(data);

  //todo: remove mock functionality
  const projects = [
    {
      id: "1",
      title: "Medical Image Dataset Collection",
      image: projectImage,
      status: "active" as const,
      submissions: 245,
      verified: 180,
      goal: 1000,
      progress: 24.5,
    },
    {
      id: "2",
      title: "NLP Dataset Collection",
      image: projectImage,
      status: "active" as const,
      submissions: 890,
      verified: 720,
      goal: 1000,
      progress: 89,
    },
    {
      id: "3",
      title: "Speech Recognition Dataset",
      image: projectImage,
      status: "completed" as const,
      submissions: 1500,
      verified: 1500,
      goal: 1500,
      progress: 100,
    },
  ];

  const statusConfig = {
    active: { label: "Active", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    completed: { label: "Completed", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
    draft: { label: "Draft", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  };

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Projects</h1>
            <p className="text-muted-foreground">Manage your data collection projects</p>
          </div>
          <Link to="/projects/create">
            <Button data-testid="button-create-project">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all" data-testid="tab-all">All ({projects.length})</TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active">Active ({projects.filter(p => p.status === 'active').length})</TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">Completed ({projects.filter(p => p.status === 'completed').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} data-testid={`card-project-${project.id}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    <Badge className={`absolute top-3 left-3 ${statusConfig[project.status].className}`}>
                      {statusConfig[project.status].label}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <h3 className="font-semibold text-lg line-clamp-2">{project.title}</h3>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-muted-foreground">Submissions</div>
                        <div className="font-semibold">{project.submissions}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Verified</div>
                        <div className="font-semibold">{project.verified}</div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Link to={`/projects/${project.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm" data-testid={`button-view-${project.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    {project.status === "completed" && (
                      <Button variant="default" className="flex-1" size="sm" data-testid={`button-publish-${project.id}`}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Publish
                      </Button>
                    )}
                    {project.status === "active" && (
                      <Button variant="ghost" size="sm" data-testid={`button-settings-${project.id}`}>
                        <Settings className="h-4 w-4" />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.status === 'active').map((project) => (
                <Card key={project.id}>
                  <div className="relative aspect-video overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    <Badge className={`absolute top-3 left-3 ${statusConfig[project.status].className}`}>
                      {statusConfig[project.status].label}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <h3 className="font-semibold text-lg line-clamp-2">{project.title}</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link to={`/projects/${project.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.filter(p => p.status === 'completed').map((project) => (
                <Card key={project.id}>
                  <div className="relative aspect-video overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    <Badge className={`absolute top-3 left-3 ${statusConfig[project.status].className}`}>
                      {statusConfig[project.status].label}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <h3 className="font-semibold text-lg line-clamp-2">{project.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Project completed successfully</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" size="sm">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Publish as Dataset
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
