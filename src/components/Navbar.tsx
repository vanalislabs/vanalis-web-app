import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConnectButton } from "@mysten/dapp-kit";
import { SearchModal } from "@/components/SearchModal";

export function Navbar() {
  const notificationCount = 3; //todo: remove mock functionality
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  return (
    <header className="sticky top-0 z-[50] flex items-center justify-between gap-4 border-b border-border bg-background/70 backdrop-blur-sm px-4 py-3 pointer-events-auto relative">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />

        <div className="relative w-96 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <Input
            type="search"
            placeholder="Search projects, datasets, or users..."
            className="pl-10 cursor-pointer"
            data-testid="input-search"
            readOnly
            onClick={handleSearchClick}
            onFocus={handleSearchClick}
          />
          <SearchModal
            open={isSearchOpen}
            onOpenChange={setIsSearchOpen}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative flex justify-center items-center" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge className="!absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center !px-0 !py-0 text-[10px] !rounded-full">
              {notificationCount}
            </Badge>
          )}
        </Button>

        <ConnectButton />
      </div>
    </header>
  );
}
