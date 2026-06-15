import { apiRequest } from "./client";
import type { CreateReviewPayload, Review, ReviewsResponse } from "./types";

export const reviewsApi = {
  getReviews: (placeId: string, limit = 20, offset = 0) =>
    apiRequest<ReviewsResponse>(
      `/v1/reviews/places/${placeId}/reviews?limit=${limit}&offset=${offset}`,
    ),

  createReview: (payload: CreateReviewPayload) =>
    apiRequest<Review>("/v1/reviews/reviews", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateReview: (id: string, rating: number, comment?: string) =>
    apiRequest<Review>(`/v1/reviews/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ rating, comment }),
    }),

  deleteReview: (id: string) =>
    apiRequest<void>(`/v1/reviews/reviews/${id}`, { method: "DELETE" }),

  getMyReviews: (limit = 20, offset = 0) =>
    apiRequest<ReviewsResponse>(
      `/v1/reviews/users/me/reviews?limit=${limit}&offset=${offset}`,
    ),
};
