import { Route, Routes } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { SidebarProvider } from "./components/ui/sidebar";
import AppLayout from "./layout/AppLayout";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import CreateProjectPage from "./pages/CreateProjectPage";
import SubmitDataPage from "./pages/SubmitDataPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import MarketplacePage from "./pages/MarketplacePage";
import DatasetDetailPage from "./pages/DatasetDetailPage";
import ActivityPage from "./pages/ActivityPage";
import LeaderboardsPage from "./pages/LeaderboardsPage";
import DashboardPage from "./pages/DashboardPage";
import MyProjectsPage from "./pages/MyProjectsPage";
import MySubmissionsPage from "./pages/MySubmissionsPage";
import MyDatasetsPage from "./pages/MyDatasetsPage";
import EarningsPage from "./pages/EarningsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Routes>
      <Route element={<AppLayout authenticated={false} />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<DatasetDetailPage />} />
        <Route path="/datasets/:id" element={<DatasetDetailPage />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
      </Route>
      <Route element={<AppLayout authenticated={true} />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects/create" element={<CreateProjectPage />} />
        <Route path="/projects/:id/submit" element={<SubmitDataPage />} />
        <Route path="/my-projects" element={<MyProjectsPage />} />
        <Route path="/my-submissions" element={<MySubmissionsPage />} />
        <Route path="/my-datasets" element={<MyDatasetsPage />} />
        <Route path="/earnings" element={<EarningsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile/:address" element={<ProfilePage />} /></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <TooltipProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <Router />
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  );
}
