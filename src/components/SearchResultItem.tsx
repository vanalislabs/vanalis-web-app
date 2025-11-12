import { forwardRef } from "react";
import { Link } from "react-router";
import { ProjectSearchResult, DatasetSearchResult, UserSearchResult } from "@/types/search";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface SearchResultItemProps {
  type: "project" | "dataset" | "user";
  data: ProjectSearchResult | DatasetSearchResult | UserSearchResult;
  onClick?: () => void;
  isSelected?: boolean;
}

export const SearchResultItem = forwardRef<HTMLAnchorElement, SearchResultItemProps>(
  ({ type, data, onClick, isSelected }, ref) => {
    const baseClasses = "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors";
    const hoverClasses = "hover:bg-gray-50 dark:hover:bg-gray-800";
    const selectedClasses = isSelected ? "bg-gray-100 dark:bg-gray-800" : "";

    if (type === "project") {
      const project = data as ProjectSearchResult;
      const statusConfig = {
        open: { label: "Open", className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
        "closing-soon": { label: "Closing Soon", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
        completed: { label: "Completed", className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
      };

      return (
        <Link
          ref={ref}
          to={`/projects/${project.id}`}
          onClick={onClick}
          className={cn(baseClasses, hoverClasses, selectedClasses)}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-12 h-12 rounded-lg object-cover aspect-square"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{project.title}</h4>
              <Badge className={cn("text-xs", statusConfig[project.status].className)}>
                {statusConfig[project.status].label}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{project.reward}</span>
              <span>•</span>
              <span>{project.submissions} submissions</span>
              <span>•</span>
              <span>{project.curatorName}</span>
            </div>
          </div>
        </Link>
      );
    }

    if (type === "dataset") {
      const dataset = data as DatasetSearchResult;

      return (
        <Link
          ref={ref}
          to={`/marketplace/${dataset.id}`}
          onClick={onClick}
          className={cn(baseClasses, hoverClasses, selectedClasses)}
        >
          <img
            src={dataset.image}
            alt={dataset.name}
            className="w-12 h-12 rounded-lg object-cover aspect-square"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{dataset.name}</h4>
              <Badge variant="outline" className="text-xs">
                {dataset.category}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{dataset.price} SUI</span>
              <span>•</span>
              <span>{dataset.itemsCount.toLocaleString()} items</span>
            </div>
          </div>
        </Link>
      );
    }

    if (type === "user") {
      const user = data as UserSearchResult;

      return (
        <Link
          ref={ref}
          to={`/profile/${user.address}`}
          onClick={onClick}
          className={cn(baseClasses, hoverClasses, selectedClasses)}
        >
          <Avatar className="w-12 h-12">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{user.username}</h4>
            </div>
            <p className="text-xs text-muted-foreground truncate">{user.address}</p>
          </div>
        </Link>
      );
    }

    return null;
  }
);

SearchResultItem.displayName = "SearchResultItem";

