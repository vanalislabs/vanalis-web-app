import { useController, Control } from "react-hook-form";
import { Upload, Image, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface FileUploadFieldProps {
  name: string;
  control: Control<any>;
  label: string;
  description?: string;
  accept?: string;
}

// Helper to format bytes to readable string
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function FileUploadField({ 
  name, 
  control, 
  label, 
  description, 
  accept 
}: FileUploadFieldProps) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only take the first file
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={error ? "text-red-500" : ""}>
        {label}
      </Label>
      
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${error 
            ? "border-red-500 bg-red-50" 
            : "border-border hover:bg-accent/50 hover:border-primary"
          }
        `}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById(name)?.click()}
      >
        <input
          type="file"
          id={name}
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />

        {value ? (
          // State: File Selected
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              {value.type.startsWith("image/") ? (
                <Image className="h-6 w-6 text-primary" />
              ) : (
                <FileText className="h-6 w-6 text-primary" />
              )}
            </div>
            <div className="text-center">
              <p className="font-medium text-sm max-w-[200px] truncate mx-auto">
                {value.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.size)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 z-10"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the file input click
                onChange(null);
              }}
            >
              <X className="mr-2 h-3 w-3" /> Remove File
            </Button>
          </div>
        ) : (
          // State: No File Selected
          <div className="flex flex-col items-center gap-2 py-4">
            <Upload className={`h-10 w-10 ${error ? "text-red-400" : "text-muted-foreground"}`} />
            <div className="space-y-1">
              <p className="font-medium text-sm">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                {accept ? accept.replace(/,/g, ", ") : "Any file"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Validation Error Message */}
      {error && (
        <p className="text-sm font-medium text-red-500 animate-in fade-in-5 slide-in-from-top-1">
          {error.message}
        </p>
      )}
    </div>
  );
}