import { useEffect, useRef, useState, useMemo } from "react";
import { useSearch } from "@/hooks/useSearch";
// import { SearchResultItem } from "@/components/SearchResultItem";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialQuery?: string;
}

type FilterType = "all" | "projects" | "datasets" | "users";

export function SearchModal({ open, onOpenChange, initialQuery = "" }: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const { data, isLoading } = useSearch(query);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Filter results based on selected filter
  const filteredData = useMemo(() => {
    if (selectedFilter === "all") {
      return data;
    }
    return {
      projects: selectedFilter === "projects" ? data.projects : [],
      datasets: selectedFilter === "datasets" ? data.datasets : [],
      users: selectedFilter === "users" ? data.users : [],
    };
  }, [data, selectedFilter]);

  // Flatten all results for keyboard navigation
  const allResults = useMemo(() => [
    ...filteredData.projects.map((p) => ({ type: "project" as const, data: p })),
    ...filteredData.datasets.map((d) => ({ type: "dataset" as const, data: d })),
    ...filteredData.users.map((u) => ({ type: "user" as const, data: u })),
  ], [filteredData.projects, filteredData.datasets, filteredData.users]);

  // Focus input when modal opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
      setSelectedIndex(-1);
    }
  }, [open]);

  // Reset selected index when query or filter changes
  useEffect(() => {
    setSelectedIndex(-1);
    itemRefs.current = [];
  }, [query, selectedFilter, allResults.length]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open || allResults.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputFocused = target.tagName === "INPUT";

      // Handle Escape key
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
        return;
      }

      // Handle Enter key
      if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < allResults.length) {
          e.preventDefault();
          const selectedItem = itemRefs.current[selectedIndex];
          if (selectedItem) {
            selectedItem.click();
            onOpenChange(false);
          }
        }
        return;
      }

      // Handle Arrow keys
      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => {
          const next = prev < allResults.length - 1 ? prev + 1 : prev;
          setTimeout(() => {
            itemRefs.current[next]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
          }, 0);
          return next;
        });
        return;
      }
      
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : -1;
          if (next >= 0) {
            setTimeout(() => {
              itemRefs.current[next]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }, 0);
          }
          return next;
        });
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, selectedIndex, allResults.length, onOpenChange]);

  const totalResults = filteredData.projects.length + filteredData.datasets.length + filteredData.users.length;
  const showResults = query.length >= 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "max-w-2xl p-0 gap-0 top-[10%] translate-y-0 left-1/2 -translate-x-1/2",
          "bg-white dark:bg-gray-900",
          "rounded-xl shadow-2xl",
          "max-h-[80vh] flex flex-col overflow-hidden",
          "border border-gray-200 dark:border-gray-800",
          "[&>button[class*='absolute']]:hidden" // Hide default close button from DialogContent
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search projects, datasets, or users..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-800">
          <Button
            variant={selectedFilter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedFilter("all")}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={selectedFilter === "projects" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedFilter("projects")}
            className="text-xs"
          >
            Projects
          </Button>
          <Button
            variant={selectedFilter === "datasets" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedFilter("datasets")}
            className="text-xs"
          >
            Datasets
          </Button>
          <Button
            variant={selectedFilter === "users" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedFilter("users")}
            className="text-xs"
          >
            Users
          </Button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto">
          {!showResults ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Start typing to search for projects, datasets, or users
              </p>
            </div>
          ) : isLoading ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : totalResults === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="py-2">
              {filteredData.projects.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b border-gray-200 dark:border-gray-800">
                    Projects
                  </div>
                  {/* {filteredData.projects.map((project, idx) => {
                    const flatIndex = idx;
                    return (
                      <div key={project.id}>
                        <SearchResultItem
                          type="project"
                          data={project}
                          isSelected={selectedIndex === flatIndex}
                          onClick={() => onOpenChange(false)}
                          ref={(el) => {
                            itemRefs.current[flatIndex] = el;
                          }}
                        />
                      </div>
                    );
                  })} */}
                </div>
              )}

              {filteredData.datasets.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b border-gray-200 dark:border-gray-800">
                    Datasets
                  </div>
                  {/* {filteredData.datasets.map((dataset, idx) => {
                    const flatIndex = filteredData.projects.length + idx;
                    return (
                      <div key={dataset.id}>
                        <SearchResultItem
                          type="dataset"
                          data={dataset}
                          isSelected={selectedIndex === flatIndex}
                          onClick={() => onOpenChange(false)}
                          ref={(el) => {
                            itemRefs.current[flatIndex] = el;
                          }}
                        />
                      </div>
                    );
                  })} */}
                </div>
              )}

              {filteredData.users.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b border-gray-200 dark:border-gray-800">
                    Users
                  </div>
                  {/* {filteredData.users.map((user, idx) => {
                    const flatIndex = filteredData.projects.length + filteredData.datasets.length + idx;
                    return (
                      <div key={user.address}>
                        <SearchResultItem
                          type="user"
                          data={user}
                          isSelected={selectedIndex === flatIndex}
                          onClick={() => onOpenChange(false)}
                          ref={(el) => {
                            itemRefs.current[flatIndex] = el;
                          }}
                        />
                      </div>
                    );
                  })} */}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

