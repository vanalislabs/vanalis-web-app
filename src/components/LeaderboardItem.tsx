import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface LeaderboardItemProps {
  rank: number;
  user: string;
  userAvatar?: string;
  metric: string;
  metricValue: string | number;
  badge?: string;
}

export function LeaderboardItem({
  rank,
  user,
  userAvatar,
  metric,
  metricValue,
  badge,
}: LeaderboardItemProps) {
  const getRankColor = () => {
    if (rank === 1) return "text-yellow-600 dark:text-yellow-400";
    if (rank === 2) return "text-gray-400 dark:text-gray-500";
    if (rank === 3) return "text-orange-600 dark:text-orange-500";
    return "text-muted-foreground";
  };

  return (
    <div className="flex items-center gap-4 p-3 hover-elevate rounded-lg" data-testid={`leaderboard-rank-${rank}`}>
      <div className={`flex items-center justify-center w-8 h-8 font-bold ${getRankColor()}`}>
        {rank <= 3 ? <Trophy className="h-5 w-5" /> : rank}
      </div>

      <Avatar className="h-10 w-10">
        <AvatarImage src={userAvatar} />
        <AvatarFallback>{user[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{user}</span>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{metric}</p>
      </div>

      <span className="font-semibold text-lg" data-testid={`metric-${rank}`}>
        {metricValue}
      </span>
    </div>
  );
}
