import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Upload, FileText, Image, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function SubmitDataPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = id;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  //todo: remove mock functionality
  const project = {
    id: projectId,
    title: "Medical Image Dataset Collection",
    reward: "5 SUI",
    requirements: [
      "X-ray images in DICOM or PNG format",
      "Minimum resolution: 1024x1024 pixels",
      "Proper anatomical region labeling",
      "Patient privacy compliance (anonymized)",
    ],
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    //todo: remove mock functionality - implement commit-reveal flow
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    console.log("Data submitted to project:", projectId);
    navigate("/my-submissions");
  };

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Data</h1>
          <p className="text-muted-foreground">Contribute to {project.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Requirements</CardTitle>
              <CardDescription>Please ensure your submission meets these requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {project.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload Data</CardTitle>
              <CardDescription>Upload your data file and provide necessary metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file">Data File *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover-elevate cursor-pointer">
                  <input
                    type="file"
                    id="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,.dcm"
                    required
                    data-testid="input-file"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    {selectedFile ? (
                      <div className="space-y-2">
                        <Image className="h-12 w-12 mx-auto text-primary" />
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button type="button" variant="outline" size="sm">
                          Change File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="font-medium">Click to upload or drag and drop</p>
                        <p className="text-sm text-muted-foreground">PNG, DICOM (max 50MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Submission Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Chest X-Ray - Frontal View"
                  required
                  data-testid="input-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about the data, annotations, and any relevant information..."
                  rows={4}
                  required
                  data-testid="input-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="e.g., x-ray, chest, medical"
                  data-testid="input-tags"
                />
                <p className="text-sm text-muted-foreground">Separate tags with commas</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Commit-Reveal Process</CardTitle>
              <CardDescription>Blockchain verification for ownership proof</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-primary">1</span>
                  </div>
                  <div>
                    <div className="font-medium">Hash Generation</div>
                    <div className="text-sm text-muted-foreground">
                      Your data will be hashed and recorded on-chain before upload
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-primary">2</span>
                  </div>
                  <div>
                    <div className="font-medium">Upload & Verify</div>
                    <div className="text-sm text-muted-foreground">
                      Upload actual data to decentralized storage for verification
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-primary">3</span>
                  </div>
                  <div>
                    <div className="font-medium">Curator Review</div>
                    <div className="text-sm text-muted-foreground">
                      Curator verifies quality and awards reward ({project.reward})
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {uploading && (
            <Card>
              <CardContent className="py-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold mb-1">Ready to Submit?</h4>
                  <p className="text-sm text-muted-foreground">
                    Your submission will be reviewed by the curator
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/projects/${projectId}`)}
                    disabled={uploading}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading || !selectedFile} data-testid="button-submit">
                    {uploading ? "Submitting..." : "Submit Data"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
