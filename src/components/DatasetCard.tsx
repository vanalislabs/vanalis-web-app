import { Database, Tag, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DatasetCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  itemsCount: number;
  category: string;
  sourceProjectId?: string;
  sourceProjectName?: string;
}

export function DatasetCard({
  id,
  name,
  image,
  price,
  itemsCount,
  category,
  sourceProjectId,
  sourceProjectName,
}: DatasetCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate active-elevate-2 transition-all h-full flex flex-col" data-testid={`card-dataset-${id}`}>
      <Link to={`/marketplace/${id}`}>
        <div className="relative aspect-video overflow-hidden cursor-pointer">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      </Link>

      <CardHeader className="pb-3">
        <Link to={`/marketplace/${id}`}>
          <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="text-xs">
            <Tag className="h-3 w-3 mr-1" />
            {category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Database className="h-3 w-3" />
            {itemsCount.toLocaleString()} items
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {sourceProjectName && (
          <Link to={`/projects/${sourceProjectId}`}>
            <div className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1">
              <span>From: {sourceProjectName}</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </Link>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div>
          <div className="text-xs text-muted-foreground">Price</div>
          <div className="text-lg font-bold text-primary">{price} SUI</div>
        </div>
        <Link to={`/marketplace/${id}`}>
          <Button size="sm" data-testid={`button-buy-${id}`}>
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
