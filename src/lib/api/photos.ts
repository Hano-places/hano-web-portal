import { apiRequest } from "./client";
import type { CreatePhotoPayload, Photo, PhotosResponse } from "./types";

export const photosApi = {
  getPlacePhotos: (placeId: string, limit = 20, offset = 0) =>
    apiRequest<PhotosResponse>(
      `/v1/photos/places/${placeId}/photos?limit=${limit}&offset=${offset}`,
    ),

  createPhoto: (payload: CreatePhotoPayload) =>
    apiRequest<Photo>("/v1/photos/photos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deletePhoto: (id: string) =>
    apiRequest<void>(`/v1/photos/photos/${id}`, { method: "DELETE" }),

  getMyPhotos: (limit = 20, offset = 0) =>
    apiRequest<PhotosResponse>(
      `/v1/photos/users/me/photos?limit=${limit}&offset=${offset}`,
    ),
};
