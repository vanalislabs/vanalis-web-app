import { Home, FolderOpen, ShoppingBag, Clock, Trophy, LayoutDashboard, Plus, FileText, Upload, Database, DollarSign, Settings } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import logoImage from "@assets/logo.png";
import { useCurrentAccount } from "@mysten/dapp-kit";

const publicItems = [
  { title: "Discover", url: "/", icon: Home },
  { title: "Projects", url: "/projects", icon: FolderOpen },
  { title: "Marketplace", url: "/marketplace", icon: ShoppingBag },
  { title: "Activity", url: "/activity", icon: Clock },
  { title: "Leaderboards", url: "/leaderboards", icon: Trophy },
];

const authenticatedItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Create Project", url: "/projects/create", icon: Plus },
  { title: "My Projects", url: "/my-projects", icon: FolderOpen },
  { title: "My Submissions", url: "/my-submissions", icon: Upload },
  { title: "My Datasets", url: "/my-datasets", icon: Database },
  { title: "Earnings", url: "/earnings", icon: DollarSign },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const account = useCurrentAccount();

  return (
    <Sidebar>
      <SidebarContent>
        <div className="px-4 py-6">
          <Link to="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate rounded-lg px-3 py-2">
              <img src={logoImage} alt="DataVault" className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">Vanalis</h1>
                <p className="text-xs text-muted-foreground">AI Dataset Marketplace</p>
              </div>
            </div>
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {publicItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {account && (
          <SidebarGroup>
            <SidebarGroupLabel>My Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {authenticatedItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname === item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Sui Network</span>
          <Badge variant="outline" className="text-green-600">
            Live
          </Badge>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
