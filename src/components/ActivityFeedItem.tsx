import { Upload, ShoppingCart, CheckCircle, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ActivityFeedItemProps {
  type: "submission" | "purchase" | "verification" | "reward";
  user: string;
  userAvatar?: string;
  action: string;
  target: string;
  timestamp: string;
  amount?: string;
}

export function ActivityFeedItem({
  type,
  user,
  userAvatar,
  action,
  target,
  timestamp,
  amount,
}: ActivityFeedItemProps) {
  const icons = {
    submission: Upload,
    purchase: ShoppingCart,
    verification: CheckCircle,
    reward: Award,
  };

  const Icon = icons[type];

  return (
    <div className="flex items-start gap-4 p-4 hover-elevate rounded-lg" data-testid={`activity-${type}`}>
      <Avatar className="h-10 w-10">
        <AvatarImage src={userAvatar} />
        <AvatarFallback>{user[0]}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-medium truncate">{user}</span>
          <span className="text-sm text-muted-foreground">{action}</span>
        </div>
        <p className="text-sm text-foreground truncate">{target}</p>
        {amount && (
          <Badge variant="secondary" className="mt-2">
            {amount}
          </Badge>
        )}
      </div>

      <span className="text-xs text-muted-foreground whitespace-nowrap">{timestamp}</span>
    </div>
  );
}
