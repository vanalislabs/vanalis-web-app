import { z } from "zod";

// Helper to convert MB to Bytes
const MB_TO_BYTES = 1024 * 1024;

export const createSubmissionSchema = (
  allowedExtension: string, 
  maxSizeInMB: number = 1 // default to 1MB if undefined
) => {
  // Normalize extension to ensure it handles "png" or ".png"
  const cleanExt = allowedExtension.replace(/^\./, "").toLowerCase();

  const validateFile = z
    .instanceof(File, { message: "File is required" })
    .refine(
      (file) => file.size <= maxSizeInMB * MB_TO_BYTES, 
      `Max file size is ${maxSizeInMB}MB`
    )
    .refine(
      (file) => file.name.toLowerCase().endsWith(`.${cleanExt}`), 
      `Invalid file type. Must be .${cleanExt}`
    );

  return z.object({
    previewFile: validateFile,
    fullFile: validateFile,
  });
};

// Export the type based on a generic run (for TypeScript inference)
export type SubmissionFormData = z.infer<ReturnType<typeof createSubmissionSchema>>;