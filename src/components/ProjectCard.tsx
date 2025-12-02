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
import { projectStatus } from "@/constants/projectStatus";
import { formattedSui } from "@/lib/convertDecimals";

interface ProjectCardProps {
  id: string;
  title: string;
  imageUrl: string;
  status: "OPEN" | "COMPLETED";
  rewardPool: number;
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

  if(rewardPool === undefined || deadline === null){
    return null;
  }

  const config = projectStatus[status] ?? {
    label: "Unknown",
    className: "bg-gray-400",
  };
  return (
    <Link to={`/projects/${id}`}>
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
              <span>{formattedSui(rewardPool)} SUI</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{getDaysRemaining(deadline)} days</span>
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
