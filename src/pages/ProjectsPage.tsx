import { useState } from "react";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectCard } from "@/components/ProjectCard";
import { Badge } from "@/components/ui/badge";
import projectImage from "@assets/dummy/Team_data_collection_illustration_dd59af91.png";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const projects = [
    {
      id: "1",
      title: "Medical Image Dataset Collection",
      image: projectImage,
      status: "open" as const,
      reward: "5,000 SUI",
      deadline: "30 days",
      submissions: 245,
      goal: 1000,
      curatorName: "Dr. Sarah Chen",
      curatorAvatar: avatarImage,
    },
    {
      id: "2",
      title: "Natural Language Processing Dataset",
      image: projectImage,
      status: "closing-soon" as const,
      reward: "3,500 SUI",
      deadline: "7 days",
      submissions: 890,
      goal: 1000,
      curatorName: "Alex Johnson",
    },
    {
      id: "3",
      title: "Computer Vision Training Data",
      image: projectImage,
      status: "open" as const,
      reward: "8,000 SUI",
      deadline: "45 days",
      submissions: 120,
      goal: 2000,
      curatorName: "Maria Garcia",
    },
    {
      id: "4",
      title: "Speech Recognition Audio Collection",
      image: projectImage,
      status: "completed" as const,
      reward: "4,200 SUI",
      deadline: "Completed",
      submissions: 1500,
      goal: 1500,
      curatorName: "John Smith",
    },
    {
      id: "5",
      title: "Autonomous Driving Scenarios",
      image: projectImage,
      status: "open" as const,
      reward: "10,000 SUI",
      deadline: "60 days",
      submissions: 340,
      goal: 3000,
      curatorName: "Emma Wilson",
    },
    {
      id: "6",
      title: "Financial Market Data Collection",
      image: projectImage,
      status: "closing-soon" as const,
      reward: "6,500 SUI",
      deadline: "5 days",
      submissions: 780,
      goal: 1000,
      curatorName: "Robert Lee",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Browse Projects</h1>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full max-w-xl">
              <Input
                type="search"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-projects"
              />
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              <Select defaultValue="all">
                <SelectTrigger className="w-40" data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closing-soon">Closing Soon</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="newest">
                <SelectTrigger className="w-40" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="reward">Highest Reward</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="submissions">Most Submissions</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1 border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-view-grid"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  data-testid="button-view-list"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" size="icon" data-testid="button-filters">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Badge variant="secondary">All Projects (6)</Badge>
            <Badge variant="outline">Open (3)</Badge>
            <Badge variant="outline">Closing Soon (2)</Badge>
            <Badge variant="outline">Completed (1)</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}>
            {projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
