import { Link } from "react-router";
import { Download, ExternalLink, Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import datasetImage from "@assets/dummy/AI_dataset_visualization_thumbnail_8ab46a36.png";

export default function MyDatasetsPage() {
  //todo: remove mock functionality
  const datasets = [
    {
      id: "1",
      name: "Curated Medical Imaging - X-Ray Collection",
      image: datasetImage,
      price: "250 SUI",
      itemsCount: 5000,
      category: "Healthcare",
      purchasedAt: "1 week ago",
      sourceProjectId: "proj-1",
      sourceProjectName: "Medical Image Dataset Collection",
      downloads: 3,
      lastDownload: "2 days ago",
    },
    {
      id: "2",
      name: "Multilingual Text Dataset",
      image: datasetImage,
      price: "180 SUI",
      itemsCount: 25000,
      category: "NLP",
      purchasedAt: "2 weeks ago",
      downloads: 5,
      lastDownload: "1 day ago",
    },
    {
      id: "3",
      name: "Speech Recognition Audio Dataset",
      image: datasetImage,
      price: "300 SUI",
      itemsCount: 10000,
      category: "Audio",
      purchasedAt: "3 weeks ago",
      downloads: 2,
      lastDownload: "5 days ago",
    },
  ];

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Datasets</h1>
          <p className="text-muted-foreground">Access and download your purchased datasets</p>
        </div>

        {datasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {datasets.map((dataset) => (
              <Card key={dataset.id} data-testid={`card-dataset-${dataset.id}`}>
                <div className="relative aspect-video overflow-hidden">
                  <img src={dataset.image} alt={dataset.name} className="w-full h-full object-cover" />
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {dataset.category}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-lg line-clamp-2">{dataset.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                    <span>{dataset.itemsCount.toLocaleString()} items</span>
                    <span>•</span>
                    <span>Purchased {dataset.purchasedAt}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {dataset.sourceProjectName && (
                    <Link to={`/projects/${dataset.sourceProjectId}`}>
                      <div className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1">
                        <span>From: {dataset.sourceProjectName}</span>
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </Link>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-muted-foreground">Downloads</div>
                      <div className="font-semibold">{dataset.downloads}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Last Download</div>
                      <div className="font-semibold">{dataset.lastDownload}</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground">Paid</div>
                    <div className="text-lg font-bold text-primary">{dataset.price}</div>
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2">
                  <Button className="flex-1" size="sm" data-testid={`button-download-${dataset.id}`}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Link to={`/marketplace/${dataset.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" size="sm" data-testid={`button-view-${dataset.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Datasets Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Browse the marketplace to find and purchase datasets for your AI training needs
                </p>
                <Link to="/marketplace">
                  <Button data-testid="button-browse-marketplace">Browse Marketplace</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
