export const BASE_URL =
  process.env.NEXT_PUBLIC_HANO_API_URL ?? "https://hano-api.onrender.com";

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  onboardingCompleted: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: UserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface Place {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  logoUrl: string;
  websiteUrl: string | null;
  verified: boolean;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlaceDetail extends Place {
  category: { id: string; name: string } | null;
  reviewStats: {
    averageRating: number;
    totalReviews: number;
  };
}

export interface PlacesResponse {
  data: Place[];
  total: number;
  hasMore: boolean;
}

export interface PlacesQuery {
  q?: string;
  category?: string;
  verified?: boolean;
  limit?: number;
  offset?: number;
  sort?: "name" | "created" | "rating";
  order?: "asc" | "desc";
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  children?: Category[];
  placeCount?: number;
}

export interface CategoriesResponse {
  data: Category[];
}

export interface SearchResult {
  places: Place[];
  total: number;
  hasMore: boolean;
  filters: {
    categories: Category[];
    hasPromotions: number;
    verified: number;
  };
}

export interface SearchQuery {
  q?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface SuggestionsResponse {
  suggestions: string[];
}

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user?: UserResponse;
}

export interface ReviewsResponse {
  data: Review[];
  total: number;
  hasMore: boolean;
}

export interface CreateReviewPayload {
  placeId: string;
  rating: number;
  comment?: string;
}

export interface Photo {
  id: string;
  url: string;
  r2Key: string;
  metadata: Record<string, unknown> | null;
  placeId: string;
  userId: string;
  createdAt: string;
  user?: UserResponse;
}

export interface PhotosResponse {
  photos: Photo[];
  total: number;
  hasMore: boolean;
}

export interface CreatePhotoPayload {
  placeId: string;
  url: string;
  r2Key: string;
  metadata?: Record<string, unknown>;
}

export interface PresignedUrlRequest {
  uploadType: string;
  fileName?: string;
  contentType?: string;
}

export interface PresignedUrlResponse {
  url: string;
  key: string;
  expiresIn: number;
}

export interface DirectUploadResponse {
  url: string;
  key: string;
}
