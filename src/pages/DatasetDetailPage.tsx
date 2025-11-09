import { Link, useParams } from "react-router";
import { Database, Tag, ExternalLink, Download, Eye, ShoppingCart, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import datasetImage from "@assets/dummy/AI_dataset_visualization_thumbnail_8ab46a36.png";
import avatarImage from "@assets/dummy/Tech_professional_avatar_headshot_e62e7352.png";

export default function DatasetDetailPage() {
  const { id } = useParams();
  const datasetId = id;

  //todo: remove mock functionality
  const dataset = {
    id: datasetId,
    name: "Curated Medical Imaging - X-Ray Collection",
    description: "High-quality medical X-ray dataset with professional annotations. Includes diverse anatomical regions, multiple viewing angles, and verified diagnostic labels. Perfect for training medical AI models for diagnostic assistance.",
    image: datasetImage,
    price: "250",
    itemsCount: 5000,
    category: "Healthcare",
    sourceProjectId: "proj-1",
    sourceProjectName: "Medical Image Dataset Collection",
    curatorName: "Dr. Sarah Chen",
    curatorAvatar: avatarImage,
    curatorAddress: "0x7a3f...9d2e",
    totalSales: 42,
    totalRevenue: "10,500 SUI",
    metadata: {
      format: "DICOM, PNG",
      resolution: "1024x1024+",
      annotationType: "Bounding boxes, Classifications",
      license: "Commercial Use Allowed",
    },
    sampleImages: [datasetImage, datasetImage, datasetImage, datasetImage],
    topContributors: [
      { name: "alice.sui", avatar: avatarImage, contributions: 1245, earnings: "622 SUI" },
      { name: "bob.sui", contributions: 986, earnings: "493 SUI" },
      { name: "carol.sui", contributions: 756, earnings: "378 SUI" },
    ],
  };

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img src={dataset.image} alt={dataset.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{dataset.name}</h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {dataset.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Database className="h-4 w-4" />
                      {dataset.itemsCount.toLocaleString()} items
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ShoppingCart className="h-4 w-4" />
                      {dataset.totalSales} sales
                    </div>
                  </div>
                </div>
              </div>

              {dataset.sourceProjectName && (
                <Link to={`/projects/${dataset.sourceProjectId}`}>
                  <Card className="mb-6 hover-elevate cursor-pointer">
                    <CardContent className="flex items-center gap-2 py-3">
                      <ExternalLink className="h-4 w-4 text-primary" />
                      <span className="text-sm">
                        From project: <span className="font-medium text-primary">{dataset.sourceProjectName}</span>
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )}

              <Tabs defaultValue="about" className="w-full">
                <TabsList>
                  <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
                  <TabsTrigger value="preview" data-testid="tab-preview">Preview</TabsTrigger>
                  <TabsTrigger value="contributors" data-testid="tab-contributors">Contributors</TabsTrigger>
                  <TabsTrigger value="license" data-testid="tab-license">License</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">{dataset.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Dataset Metadata</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Format</div>
                          <div className="font-medium">{dataset.metadata.format}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Resolution</div>
                          <div className="font-medium">{dataset.metadata.resolution}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Annotations</div>
                          <div className="font-medium">{dataset.metadata.annotationType}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">License</div>
                          <div className="font-medium">{dataset.metadata.license}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Sample Images</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {dataset.sampleImages.map((img, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden border border-border">
                        <img src={img} alt={`Sample ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Purchase dataset to access all {dataset.itemsCount.toLocaleString()} items
                  </p>
                </TabsContent>

                <TabsContent value="contributors" className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Top Contributors</h3>
                  <div className="space-y-3">
                    {dataset.topContributors.map((contributor, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contributor.avatar} />
                            <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{contributor.name}</div>
                            <div className="text-sm text-muted-foreground">{contributor.contributions} contributions</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">{contributor.earnings}</div>
                          <div className="text-xs text-muted-foreground">earned (50%)</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Card className="mt-6">
                    <CardContent className="py-4">
                      <h4 className="font-semibold mb-3">Royalty Distribution</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Contributors</span>
                          <span className="font-medium">50%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Curator</span>
                          <span className="font-medium">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform</span>
                          <span className="font-medium">20%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="license" className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Usage License</h3>
                  <Card>
                    <CardContent className="py-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                        </div>
                        <div>
                          <div className="font-medium">Commercial Use</div>
                          <div className="text-sm text-muted-foreground">Use for commercial AI model training</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                        </div>
                        <div>
                          <div className="font-medium">Redistribution</div>
                          <div className="text-sm text-muted-foreground">Share trained models publicly</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
                        </div>
                        <div>
                          <div className="font-medium">Attribution</div>
                          <div className="text-sm text-muted-foreground">Credit original dataset creators</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Purchase Dataset</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Price</div>
                  <div className="text-4xl font-bold text-primary">{dataset.price} SUI</div>
                </div>

                <Button className="w-full" size="lg" data-testid="button-purchase">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Purchase Access
                </Button>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span className="font-medium">{dataset.itemsCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Sales</span>
                    <span className="font-medium">{dataset.totalSales}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Revenue</span>
                    <span className="font-medium">{dataset.totalRevenue}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={dataset.curatorAvatar} />
                      <AvatarFallback>{dataset.curatorName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xs text-muted-foreground">Curated by</div>
                      <div className="font-medium">{dataset.curatorName}</div>
                      <div className="text-xs text-muted-foreground">{dataset.curatorAddress}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
