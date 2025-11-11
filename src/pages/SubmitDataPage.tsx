import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Upload, Image, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
}

// File type validation
function isValidFileType(file: File): boolean {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'application/dicom'];
  const validExtensions = ['.dcm', '.png', '.jpg', '.jpeg', '.gif'];
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
  return validTypes.includes(file.type) || validExtensions.includes(fileExtension);
}

// Submission create request interface
interface SubmissionCreateRequest {
  projectId: string | undefined;
  title: string;
  description: string;
  tags: string[];
  previewDatasetUrl: string;
  fullDatasetUrl: string;
  previewDatasetSize: string;
  fullDatasetSize: string;
  status: "pending";
}

// Mock upload function (will be replaced with real Walrus SDK integration)
async function mockUploadToStorage(
  file: File,
  options: { accessible: boolean; locked?: boolean },
  onProgress?: (progress: number) => void
): Promise<string> {
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 10) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    onProgress?.(i);
  }
  // Return mock URL
  return `https://walrus-storage.example.com/datasets/${Date.now()}-${file.name}`;
}

// Mock create submission function (will be replaced with real API call)
async function mockCreateSubmission(submission: SubmissionCreateRequest): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Log submission data (will be replaced with real API call)
  console.log("Creating submission:", submission);
}

export default function SubmitDataPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = id;
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [fullFile, setFullFile] = useState<File | null>(null);
  const [uploadingPreview, setUploadingPreview] = useState(false);
  const [uploadingFull, setUploadingFull] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [fullProgress, setFullProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [draggingPreview, setDraggingPreview] = useState(false);
  const [draggingFull, setDraggingFull] = useState(false);

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

  const handlePreviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!isValidFileType(file)) {
        setError("Invalid file type. Please upload PNG, DICOM, or other image files.");
        return;
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`Preview file size exceeds 50MB limit. File size: ${formatFileSize(file.size)}`);
        return;
      }
      
      setPreviewFile(file);
      setError(""); // Clear previous errors
    }
  };

  const handleFullFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!isValidFileType(file)) {
        setError("Invalid file type. Please upload PNG, DICOM, or other image files.");
        return;
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`Full file size exceeds 50MB limit. File size: ${formatFileSize(file.size)}`);
        return;
      }
      
      setFullFile(file);
      setError(""); // Clear previous errors
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, type: 'preview' | 'full') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'preview') setDraggingPreview(true);
    else setDraggingFull(true);
  };

  const handleDragLeave = (e: React.DragEvent, type: 'preview' | 'full') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'preview') setDraggingPreview(false);
    else setDraggingFull(false);
  };

  const handleDrop = (e: React.DragEvent, type: 'preview' | 'full') => {
    e.preventDefault();
    e.stopPropagation();
    if (type === 'preview') setDraggingPreview(false);
    else setDraggingFull(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!isValidFileType(file)) {
        setError("Invalid file type. Please upload PNG, DICOM, or other image files.");
        return;
      }
      
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`${type === 'preview' ? 'Preview' : 'Full'} file size exceeds 50MB limit. File size: ${formatFileSize(file.size)}`);
        return;
      }
      
      if (type === 'preview') {
        setPreviewFile(file);
      } else {
        setFullFile(file);
      }
      setError(""); // Clear previous errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError("");
    setSubmitStatus("");

    // Validation
    if (!previewFile || !fullFile) {
      setError("Please upload both preview and full dataset files");
      return;
    }

    // Get form values
    const title = (document.getElementById("title") as HTMLInputElement)?.value;
    const description = (document.getElementById("description") as HTMLTextAreaElement)?.value;
    const tags = (document.getElementById("tags") as HTMLInputElement)?.value;

    if (!title || !description) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSubmitStatus("");

      // Step 1: Upload preview dataset (accessible immediately)
      setUploadingPreview(true);
      setPreviewProgress(0);
      setSubmitStatus("Uploading preview dataset...");
      const previewUrl = await mockUploadToStorage(
        previewFile,
        { accessible: true },
        (progress) => {
          setPreviewProgress(progress);
        }
      );
      setUploadingPreview(false);

      // Step 2: Upload full dataset (locked until approve)
      setUploadingFull(true);
      setFullProgress(0);
      setSubmitStatus("Uploading full dataset...");
      const fullUrl = await mockUploadToStorage(
        fullFile,
        { accessible: false, locked: true },
        (progress) => {
          setFullProgress(progress);
        }
      );
      setUploadingFull(false);

      // Step 3: Create submission with metadata
      setSubmitStatus("Creating submission...");
      const submission = {
        projectId,
        title,
        description,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
        previewDatasetUrl: previewUrl,
        fullDatasetUrl: fullUrl,
        previewDatasetSize: formatFileSize(previewFile.size),
        fullDatasetSize: formatFileSize(fullFile.size),
        status: "pending" as const,
      };

      await mockCreateSubmission(submission);

      // Clear status before navigation
      setSubmitStatus("");
      setSubmitting(false);
      
      // Navigate to my-submissions
      navigate("/my-submissions");
    } catch (error) {
      // Handle error
      console.error("Submission failed:", error);
      setError("Submission failed. Please try again.");
      setSubmitStatus("");
      setUploadingPreview(false);
      setUploadingFull(false);
      setSubmitting(false);
      setPreviewProgress(0); // Reset progress
      setFullProgress(0); // Reset progress
    }
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
                <Label htmlFor="preview-file">Preview Dataset *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Representative sample data from the full dataset for curator review
                </p>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center hover-elevate cursor-pointer transition-colors ${
                    draggingPreview
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onDragOver={(e) => handleDragOver(e, "preview")}
                  onDragLeave={(e) => handleDragLeave(e, "preview")}
                  onDrop={(e) => handleDrop(e, "preview")}
                  aria-label="Upload preview dataset"
                >
                  <input
                    type="file"
                    id="preview-file"
                    className="hidden"
                    onChange={handlePreviewFileChange}
                    accept="image/*,.dcm"
                    required
                    data-testid="input-preview-file"
                  />
                  <label htmlFor="preview-file" className="cursor-pointer">
                    {previewFile ? (
                      <div className="space-y-2">
                        <Image className="h-12 w-12 mx-auto text-primary" />
                        <p className="font-medium">{previewFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(previewFile.size)}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("preview-file")?.click();
                          }}
                        >
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
                <p className="text-xs text-muted-foreground">
                  Preview must be representative and show the same quality as the full dataset
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="full-file">Full Dataset *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Complete data that will be locked until curator approval
                </p>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center hover-elevate cursor-pointer transition-colors ${
                    draggingFull
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  onDragOver={(e) => handleDragOver(e, "full")}
                  onDragLeave={(e) => handleDragLeave(e, "full")}
                  onDrop={(e) => handleDrop(e, "full")}
                  aria-label="Upload full dataset"
                >
                  <input
                    type="file"
                    id="full-file"
                    className="hidden"
                    onChange={handleFullFileChange}
                    accept="image/*,.dcm"
                    required
                    data-testid="input-full-file"
                  />
                  <label htmlFor="full-file" className="cursor-pointer">
                    {fullFile ? (
                      <div className="space-y-2">
                        <Image className="h-12 w-12 mx-auto text-primary" />
                        <p className="font-medium">{fullFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(fullFile.size)}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            document.getElementById("full-file")?.click();
                          }}
                        >
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
                <p className="text-xs text-muted-foreground">
                  Full dataset will be locked in storage until the submission is approved by the curator
                </p>
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
              <CardTitle>Preview-First System</CardTitle>
              <CardDescription>Preview dataset for review, full dataset locked until approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-primary">1</span>
                  </div>
                  <div>
                    <div className="font-medium">Upload Preview Dataset</div>
                    <div className="text-sm text-muted-foreground">
                      Upload representative sample data for curator review. Preview dataset is immediately accessible to the curator.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-primary">2</span>
                  </div>
                  <div>
                    <div className="font-medium">Upload Full Dataset</div>
                    <div className="text-sm text-muted-foreground">
                      Upload complete data that will be locked in storage. Full dataset remains locked until curator approval.
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-medium text-primary">3</span>
                  </div>
                  <div>
                    <div className="font-medium">Submit & Review</div>
                    <div className="text-sm text-muted-foreground">
                      Curator reviews preview dataset for quality verification. If approved → full dataset is unlocked → reward distributed ({project.reward}). If rejected → submission is declined (full dataset remains locked).
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> Preview dataset = Sample Data (a representative portion of the full dataset, not a thumbnail or compressed version). 
                  Example: If the full dataset contains 1000 images, the preview can contain 50-100 representative sample images.
                </p>
              </div>
            </CardContent>
          </Card>

          {(uploadingPreview || uploadingFull || submitting) && (
            <Card>
              <CardContent className="py-6">
                <div className="space-y-4">
                  {submitStatus && (
                    <div className="text-sm font-medium text-primary" aria-live="polite">{submitStatus}</div>
                  )}
                  
                  {uploadingPreview && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading preview dataset...</span>
                        <span>{previewProgress}%</span>
                      </div>
                      <Progress value={previewProgress} className="h-2" aria-live="polite" />
                    </div>
                  )}

                  {uploadingFull && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading full dataset...</span>
                        <span>{fullProgress}%</span>
                      </div>
                      <Progress value={fullProgress} className="h-2" aria-live="polite" />
                    </div>
                  )}

                  {submitting && !uploadingPreview && !uploadingFull && (
                    <div className="text-sm text-muted-foreground">
                      Creating submission...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card>
              <CardContent className="py-6">
                <div className="text-sm text-destructive">{error}</div>
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
                    disabled={uploadingPreview || uploadingFull || submitting}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploadingPreview || uploadingFull || submitting || !previewFile || !fullFile}
                    data-testid="button-submit"
                  >
                    {submitting || uploadingPreview || uploadingFull ? "Submitting..." : "Submit Data"}
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
