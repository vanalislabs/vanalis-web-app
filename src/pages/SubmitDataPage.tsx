import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadField } from "@/components/FileUploadField"; // <--- EXTRACTED COMPONENT
import Loading from "@/loading";
import { Progress } from "@/components/ui/progress";

// Logic & Types
import { useGetProjectById } from "@/hooks/project/useGetProjectById";
import { useSubmitWorkflow } from "@/hooks/submission/useSubmitWorkflow"; // <--- ORCHESTRATOR
import {
  createSubmissionSchema,
  SubmissionFormData,
} from "@/schemas/submissionSchemas"; // <--- ZOD SCHEMA
import { ReceiptModal } from "@/components/ReceiptModal";
import { useMemo, useState } from "react";
import { useNetworkVariable } from "@/networkConfig";

export default function SubmitDataPage() {
  const { id } = useParams();
  const projectId = id ?? "";
  const navigate = useNavigate();

  const [showReceipt, setShowReceipt] = useState(false);
  const [suiTxDigest, setSuiTxDigest] = useState("");
  const [walrusBlobId, setWalrusBlobId] = useState("");
  const vanalisPackageId = useNetworkVariable("vanalisPackageId");

  // 1. Fetch Project Data
  const {
    data: projectData,
    isLoading,
    error: projectError,
  } = useGetProjectById(projectId);

  // 2. Initialize Workflow Hook (Handles Walrus, Keypair, Encryption, Chain)
  const {
    startWorkflow,
    status,
    isLoading: isSubmitting,
  } = useSubmitWorkflow();

  const schema = useMemo(() => {
    // Fallback while loading to prevent crashes
    if (!projectData) {
       // Return a "deny all" or "basic" schema while loading
       return createSubmissionSchema("txt", 1); 
    }
    
    return createSubmissionSchema(projectData.dataType);
  }, [projectData]);

  // 3. Initialize Form (Handles Validation & Input State)
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // 4. Handle Submit
  const onSubmit = async (data: SubmissionFormData) => {
    const result = await startWorkflow(data.fullFile, data.previewFile);
    if (result) {
      setWalrusBlobId(result.blobId);
      setSuiTxDigest(result.suiTxDigest);
      setShowReceipt(true);
    }
  };

  const getProgressValue = () => {
    switch (status) {
      case "idle":
        return 0;
      case "uploading_full":
        return 20;
      case "fetching_keys":
        return 30;
      case "encrypting":
        return 35;
      case "uploading_walrus":
        return 45;
      case "submitting_chain":
        return 80;
      case "success":
        return 100;
      default:
        return 0;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "uploading_full":
        return "Uploading Full Dataset...";
      case "fetching_keys":
        return "Securing Encryption Keys...";
      case "encrypting":
        return "Encrypting File Path...";
      case "uploading_walrus":
        return "Uploading Preview to Walrus...";
      case "submitting_chain":
        return "Waiting for Wallet Signature...";
      case "success":
        return "Submission Complete!";
      case "error":
        return "Submission Failed";
      default:
        return "";
    }
  };

  const progressValue = getProgressValue();
  const currentLabel = getStatusLabel();

  if (isLoading) return <Loading />;
  if (projectError || !projectData) {
    return (
      <div className="text-center py-8 text-red-500">Project not found</div>
    );
  }

  return (
    <div className="flex flex-col p-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Data</h1>
          <p className="text-muted-foreground">Contribute to {projectData.title}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {projectData.submissionRequirements.map((req, index) => (
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
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploadField
                name="previewFile"
                control={control}
                label="Preview Dataset *"
                description="Representative sample data (visible to curator)"
                accept={projectData.dataType}
              />

              <FileUploadField
                name="fullFile"
                control={control}
                label="Full Dataset *"
                description="Complete data (encrypted & locked until approval)"
                accept={projectData.dataType}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span
                    className={
                      status === "error" ? "text-red-500" : "text-primary"
                    }
                  >
                    {currentLabel}
                  </span>
                  {isSubmitting && (
                    <span className="text-muted-foreground">
                      {progressValue}%
                    </span>
                  )}
                </div>

                {isSubmitting && (
                  <Progress
                    value={progressValue}
                    className="h-2 transition-all"
                  />
                )}

                {/* 3. Buttons */}
                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader className="animate-spin w-7" />
                    ) : (
                      "Submit Data"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
      <ReceiptModal
        open={showReceipt}
        onOpenChange={setShowReceipt}
        header="Submission Uploaded Successfully!"
        description="Your dataset is stored on Walrus and registered on Sui blockchain."
        itemName={projectData.title}
        type="submission"
        time={Date.now()}
        withWalrus={walrusBlobId}
        withSui={suiTxDigest}
        withSmartContract={vanalisPackageId}
        withLink="/my-submissions"
        buttonLabel="View My Submissions"
      />
    </div>
  );
}
