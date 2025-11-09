import { useState } from "react";
import { Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatasetCard } from "@/components/DatasetCard";
import { Badge } from "@/components/ui/badge";
import datasetImage from "@assets/dummy/AI_dataset_visualization_thumbnail_8ab46a36.png";

export default function MarketplacePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  //todo: remove mock functionality
  const datasets = [
    {
      id: "1",
      name: "Curated Medical Imaging - X-Ray Collection",
      image: datasetImage,
      price: "250",
      itemsCount: 5000,
      category: "Healthcare",
      sourceProjectId: "proj-1",
      sourceProjectName: "Medical Image Collection",
    },
    {
      id: "2",
      name: "Multilingual Text Dataset - 50 Languages",
      image: datasetImage,
      price: "180",
      itemsCount: 25000,
      category: "NLP",
      sourceProjectId: "proj-2",
      sourceProjectName: "NLP Dataset Collection",
    },
    {
      id: "3",
      name: "Autonomous Driving Scenarios",
      image: datasetImage,
      price: "420",
      itemsCount: 15000,
      category: "Computer Vision",
      sourceProjectId: "proj-3",
      sourceProjectName: "Driving Data Collection",
    },
    {
      id: "4",
      name: "Speech Recognition Audio Dataset",
      image: datasetImage,
      price: "300",
      itemsCount: 10000,
      category: "Audio",
    },
    {
      id: "5",
      name: "E-commerce Product Images",
      image: datasetImage,
      price: "150",
      itemsCount: 8000,
      category: "Computer Vision",
    },
    {
      id: "6",
      name: "Financial Time Series Data",
      image: datasetImage,
      price: "500",
      itemsCount: 20000,
      category: "Finance",
      sourceProjectId: "proj-6",
      sourceProjectName: "Financial Market Data",
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dataset Marketplace</h1>

          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full max-w-xl">
              <Input
                type="search"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-datasets"
              />
            </div>

            <div className="flex gap-2 items-center flex-wrap">
              <Select defaultValue="all">
                <SelectTrigger className="w-40" data-testid="select-category-filter">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="nlp">NLP</SelectItem>
                  <SelectItem value="cv">Computer Vision</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="newest">
                <SelectTrigger className="w-40" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="items">Most Items</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1 border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  data-testid="button-view-grid"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  data-testid="button-view-list"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline" size="icon" data-testid="button-filters">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 flex-wrap">
            <Badge variant="secondary">All Datasets (6)</Badge>
            <Badge variant="outline">Healthcare (1)</Badge>
            <Badge variant="outline">NLP (1)</Badge>
            <Badge variant="outline">Computer Vision (2)</Badge>
            <Badge variant="outline">Audio (1)</Badge>
            <Badge variant="outline">Finance (1)</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
            {datasets.map((dataset) => (
              <DatasetCard key={dataset.id} {...dataset} />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
