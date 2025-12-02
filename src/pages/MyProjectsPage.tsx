import { Link } from "react-router";
import { Plus, Settings, Eye, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/loading";
import { useGetMyProjects } from "@/hooks/project/useGetMyProjects";
import MyProjectCard from "@/components/MyProjectCard";
import { PaginationControl } from "@/components/PaginationControl";

export default function MyProjectsPage() {
  const {
    data: projects,
    isLoading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
  } = useGetMyProjects();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-red-500">Failed to load projects</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Projects</h1>
            <p className="text-muted-foreground">
              Manage your data collection projects
            </p>
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
            <TabsTrigger value="all" data-testid="tab-all">
              All ({projects.length})
            </TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active">
              Active ({projects.filter((p) => p.status === "OPEN").length})
            </TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed">
              Completed (
              {projects.filter((p) => p.status === "COMPLETED").length})
            </TabsTrigger>
          </TabsList>
          {projects.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <p className="text-black">Project is empty</p>
            </div>
          )}

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <MyProjectCard key={project.id} {...project} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter((p) => p.status === "OPEN")
                .map((project) => (
                  <MyProjectCard key={project.id} {...project} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter((p) => p.status === "COMPLETED")
                .map((project) => (
                  <MyProjectCard key={project.id} {...project} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        <PaginationControl
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
        />
      </div>
    </div>
  );
}
