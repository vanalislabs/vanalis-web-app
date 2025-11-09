import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActivityFeedItem } from "@/components/ActivityFeedItem";
import { Badge } from "@/components/ui/badge";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";

export default function ActivityPage() {
  const [filter, setFilter] = useState("all");

  //todo: remove mock functionality
  const activities = [
    { type: "submission" as const, user: "alice.sui", userAvatar: avatarImage, action: "submitted to", target: "Medical Image Dataset Collection", timestamp: "2 hours ago" },
    { type: "purchase" as const, user: "bob.sui", action: "purchased", target: "AI Training Dataset - Natural Language", timestamp: "3 hours ago", amount: "150 SUI" },
    { type: "verification" as const, user: "curator1.sui", action: "verified", target: "Computer Vision Training Data submission", timestamp: "5 hours ago" },
    { type: "reward" as const, user: "carol.sui", userAvatar: avatarImage, action: "earned reward from", target: "Medical Image Dataset Collection", timestamp: "6 hours ago", amount: "50 SUI" },
    { type: "submission" as const, user: "david.sui", action: "submitted to", target: "NLP Dataset Collection", timestamp: "8 hours ago" },
    { type: "purchase" as const, user: "eve.sui", action: "purchased", target: "Speech Recognition Audio Dataset", timestamp: "10 hours ago", amount: "300 SUI" },
    { type: "verification" as const, user: "curator2.sui", action: "verified", target: "Medical imaging submission", timestamp: "12 hours ago" },
    { type: "submission" as const, user: "frank.sui", action: "submitted to", target: "Autonomous Driving Scenarios", timestamp: "15 hours ago" },
    { type: "reward" as const, user: "grace.sui", action: "earned reward from", target: "Financial Market Data", timestamp: "18 hours ago", amount: "75 SUI" },
    { type: "purchase" as const, user: "henry.sui", action: "purchased", target: "E-commerce Product Images", timestamp: "1 day ago", amount: "150 SUI" },
  ];

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Activity Feed</h1>
          <p className="text-muted-foreground">Real-time updates from the platform</p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={filter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("all")}
              data-testid="filter-all"
            >
              All Activity
            </Badge>
            <Badge
              variant={filter === "submissions" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("submissions")}
              data-testid="filter-submissions"
            >
              Submissions
            </Badge>
            <Badge
              variant={filter === "purchases" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("purchases")}
              data-testid="filter-purchases"
            >
              Purchases
            </Badge>
            <Badge
              variant={filter === "verifications" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("verifications")}
              data-testid="filter-verifications"
            >
              Verifications
            </Badge>
            <Badge
              variant={filter === "rewards" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter("rewards")}
              data-testid="filter-rewards"
            >
              Rewards
            </Badge>
          </div>

          <Select defaultValue="newest">
            <SelectTrigger className="w-40" data-testid="select-sort">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {activities.map((activity, index) => (
            <ActivityFeedItem key={index} {...activity} />
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="outline" data-testid="button-load-more">Load More</Button>
        </div>
      </div>
    </div>
  );
}
