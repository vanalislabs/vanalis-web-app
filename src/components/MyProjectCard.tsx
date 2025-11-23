import {
  Calendar,
  Users,
  DollarSign,
  Eye,
  CheckCircle,
  Settings,
} from "lucide-react";
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
import { projectStatus } from "@/constants/projectStatus";
import { formattedSui } from "@/lib/convertDecimals";
import { Button } from "./ui/button";

interface MyProjectCardProps {
  id: string;
  title: string;
  imageUrl: string;
  status: "OPEN" | "COMPLETED" | "closing-soon";
  rewardPool: number;
  deadline: number;
  approvedCount: number;
  targetSubmissions: number;
  curator?: string;
  curatorAvatar?: string;
  submissionsCount: number;
}

export default function MyProjectCard({
  id,
  title,
  imageUrl,
  status,
  rewardPool,
  deadline,
  approvedCount,
  targetSubmissions,
  submissionsCount,
  curator,
  curatorAvatar,
}: MyProjectCardProps) {
  const progress = (approvedCount / targetSubmissions) * 100;

  if (!rewardPool || !deadline) {
    return null;
  }

  const config = projectStatus[status] ?? {
    label: "Unknown",
    className: "bg-gray-400",
  };
  return (
    <Card key={id}>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <Badge className={`absolute top-3 left-3 ${config.className}`}>
          {config.label}
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-muted-foreground">Submissions</div>
            <div className="font-semibold">{submissionsCount}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Approved</div>
            <div className="font-semibold">{approvedCount}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/projects/${id}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full"
            size="sm"
            data-testid={`button-view-${id}`}
          >
            <Eye className="mr-2 h-4 w-4" />
            View
          </Button>
        </Link>
        {status === "COMPLETED" && (
          <Button
            variant="default"
            className="flex-1"
            size="sm"
            data-testid={`button-publish-${id}`}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Publish
          </Button>
        )}
        {status === "OPEN" && (
          <Button
            variant="ghost"
            size="sm"
            data-testid={`button-settings-${id}`}
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
