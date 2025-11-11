import { useState } from "react";
import { Download, Image as ImageIcon, FileText, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PreviewDatasetViewerProps {
  previewUrl: string;
  previewSize?: string;
  type?: "image" | "file" | "auto";
}

export function PreviewDatasetViewer({ previewUrl, previewSize, type = "auto" }: PreviewDatasetViewerProps) {
  const [imageError, setImageError] = useState(false);

  // Validate previewUrl
  if (!previewUrl || previewUrl.trim() === "") {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Preview URL not available</p>
        </CardContent>
      </Card>
    );
  }

  // Auto-detect type based on URL extension if type is "auto"
  const detectType = (url: string): "image" | "file" => {
    if (type !== "auto") return type;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some((ext) => lowerUrl.includes(ext)) ? "image" : "file";
  };

  const previewType = detectType(previewUrl);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = previewUrl;
    link.download = previewUrl.split("/").pop() || "preview";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (previewType === "image") {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
              {imageError ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <svg className="h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">Preview image unavailable</p>
                </div>
              ) : (
                <img
                  src={previewUrl}
                  alt="Preview dataset"
                  className="w-full h-full object-contain"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="h-4 w-4" />
                <span>Image Preview</span>
                {previewSize && <span>• {previewSize}</span>}
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Preview
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // File list view for non-image files
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>File Preview</span>
              {previewSize && <span>• {previewSize}</span>}
            </div>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Preview
            </Button>
          </div>
          <ScrollArea className="h-48 rounded-md border border-border p-4">
            <div className="flex items-center gap-3 text-sm">
              <File className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{previewUrl.split("/").pop() || "preview_file"}</p>
                <p className="text-xs text-muted-foreground">Preview dataset file</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

