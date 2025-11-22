import { Calendar, Users, DollarSign } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getDaysRemaining } from "@/lib/convertDate";

interface ProjectCardProps {
  id: string;
  title: string;
  imageUrl: string;
  status: "OPEN" | "COMPLETED" | "closing-soon";
  rewardPool: string;
  deadline: number;
  approvedCount: number;
  targetSubmissions: number;
  curator?: string;
  curatorAvatar?: string;
}

export function ProjectCard({
  id,
  title,
  imageUrl,
  status,
  rewardPool,
  deadline,
  approvedCount,
  targetSubmissions,
  curator,
  curatorAvatar,
}: ProjectCardProps) {
  const progress = (approvedCount / targetSubmissions) * 100;

  const SUI_DECIMALS = 1_000_000_000n;

  const rewardPoolBigInt = BigInt(rewardPool);

  const integerPart = rewardPoolBigInt / SUI_DECIMALS;
  const fractionalPart = rewardPoolBigInt % SUI_DECIMALS;

  const fractionalTwoDigits = Number((fractionalPart * 100n) / SUI_DECIMALS)
    .toString()
    .padStart(2, "0");

  const formattedReward = `${integerPart.toString()}.${fractionalTwoDigits}`;
  const formattedDeadline = getDaysRemaining(BigInt(deadline));

  const statusConfig = {
    OPEN: {
      label: "Open",
      variant: "default" as const,
      className:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    COMPLETED: {
      label: "Completed",
      variant: "outline" as const,
      className:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    },
    "closing-soon": {
      label: "Closing Soon",
      variant: "secondary" as const,
      className:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
  };

  const config = statusConfig[status] ?? {
    label: "Unknown",
    className: "bg-gray-400",
  };
  return (
    <Link to={`/projects/${id}`} data-testid={`card-project-${id}`}>
      <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all cursor-pointer h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <Badge
            className={`absolute top-3 left-3 w-auto text-black ${config.className}`}
          >
            {config.label}
          </Badge>
        </div>

        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        </CardHeader>

        <CardContent className="space-y-4 flex-1">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medCm">
                {approvedCount}/{targetSubmissions} submissions
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{formattedReward}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formattedDeadline} days</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center gap-2 w-full">
            <Avatar className="h-6 w-6">
              <AvatarImage src={curatorAvatar} />
              <AvatarFallback>{curator}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground truncate">
              {curator}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
