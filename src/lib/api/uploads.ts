import { apiMultipart, apiRequest } from "./client";
import type {
  DirectUploadResponse,
  PresignedUrlRequest,
  PresignedUrlResponse,
} from "./types";

export const uploadsApi = {
  getPresignedUrl: (payload: PresignedUrlRequest) =>
    apiRequest<PresignedUrlResponse>("/v1/uploads/uploads/presigned-url", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  directUpload: async (file: File, uploadType: string): Promise<DirectUploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", uploadType);
    return apiMultipart<DirectUploadResponse>("/v1/uploads/uploads/direct", formData);
  },
};
