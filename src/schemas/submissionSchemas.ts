import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "application/dicom"];

export const submissionSchema = z.object({
  previewFile: z
    .instanceof(File, { message: "Preview file is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 1MB")
    .refine((file) => ACCEPTED_TYPES.includes(file.type), "Invalid file type"),
  fullFile: z
    .instanceof(File, { message: "Full dataset is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 1MB")
    .refine((file) => ACCEPTED_TYPES.includes(file.type), "Invalid file type"),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;