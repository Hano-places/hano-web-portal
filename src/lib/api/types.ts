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

export interface SearchPlace {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  verified: boolean;
  category: { id: string; name: string } | null;
  reviewStats: { averageRating: number; totalReviews: number };
  activePromotions: number;
}

export interface SearchResult {
  places: SearchPlace[];
  total: number;
  hasMore: boolean;
  filters: {
    categories: { id: string; name: string; count: number }[];
    hasPromotions: number;
    verified: number;
  };
}

export interface SearchQuery {
  q?: string;
  category?: string;
  verified?: boolean;
  hasPromotions?: boolean;
  minRating?: number;
  limit?: number;
  offset?: number;
  sort?: "relevance" | "name" | "rating" | "newest";
}

export interface Suggestion {
  type: "place" | "category";
  id: string;
  name: string;
  description?: string;
}

export interface SuggestionsResponse {
  suggestions: Suggestion[];
}

export interface ReviewUser {
  id: string;
  name: string;
  image: string | null;
}

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: ReviewUser;
}

export interface ReviewsResponse {
  reviews: Review[];
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

export type UploadType = "photo" | "document" | "banner" | "logo" | "moment";

export interface PresignedUrlRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadType: UploadType;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresIn: number;
}

export interface DirectUploadResponse {
  url: string;
  key: string;
  size: number;
}

// ---------------------------------------------------------------------------
// Consumer menu (GET /v1/places/places/:placeId/menu)
// ---------------------------------------------------------------------------

export interface MenuCategoryWithCount {
  id: string;
  name: string;
  displayOrder: number;
  itemCount: number;
}

export interface MenuItemImage {
  id: string;
  url: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface GlobalMenuItemRef {
  id: string;
  canonicalName: string;
  category: string;
}

export interface MenuCategoryRef {
  id: string;
  name: string;
}

export interface ConsumerMenuItem {
  id: string;
  customName: string | null;
  globalItem: GlobalMenuItemRef;
  shortDescription: string | null;
  longDescription: string | null;
  price: number;
  preparationTimeMinutes: number | null;
  categories: MenuCategoryRef[];
  images: MenuItemImage[];
  dietaryTags: string[];
  spiceLevel: "mild" | "medium" | "hot" | null;
  portionInfo: string | null;
  availabilityStatus: "active" | "inactive" | "hidden" | "archived";
  isFeatured: boolean;
  featuredRank: number | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConsumerMenuResponse {
  categories: MenuCategoryWithCount[];
  items: ConsumerMenuItem[];
}

// ---------------------------------------------------------------------------
// Promotions (GET /v1/promotions/places/:placeId/promotions)
// ---------------------------------------------------------------------------

export type PromotionType = "DISCOUNT" | "BOGO" | "FREE_ITEM" | "LOYALTY";
export type PromotionStatus = "ACTIVE" | "PAUSED" | "EXPIRED" | "DRAFT";

export interface Promotion {
  id: string;
  title: string;
  description: string;
  type: PromotionType;
  discountValue: string | null;
  isPercentage: boolean;
  minimumPurchase: string | null;
  startDate: string;
  endDate: string;
  maxUses: string | null;
  currentUses: string | null;
  maxUsesPerUser: string | null;
  status: PromotionStatus;
  termsAndConditions: string | null;
  promoCode: string | null;
  placeId: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  targetItemIds: string[] | null;
  targetCategoryIds: string[] | null;
  viewCount: number;
  totalDiscountGiven: string;
}

export interface PromotionsResponse {
  promotions: Promotion[];
  total: number;
  hasMore: boolean;
}

// ---------------------------------------------------------------------------
// Carts (/v1/carts) — responses validate against CartWithItemsSchema, which
// does NOT include subtotal; compute it client-side from items.
// ---------------------------------------------------------------------------

export type CartStatus = "active" | "checked_out";
export type ItemAvailabilityStatus =
  | "active"
  | "inactive"
  | "hidden"
  | "archived";

export interface CartItemMenu {
  id: string;
  customName: string | null;
  price: number;
  shortDescription: string | null;
  availabilityStatus: ItemAvailabilityStatus;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  quantity: number;
  notes: string | null;
  createdAt: string;
  menuItem: CartItemMenu;
}

export interface Cart {
  id: string;
  userId: string;
  placeId: string;
  status: CartStatus;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
  place: { id: string; name: string };
}

export interface CreateCartPayload {
  placeId: string;
}

export interface AddCartItemPayload {
  menuItemId: string;
  quantity?: number;
  notes?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
  notes?: string;
}

// ---------------------------------------------------------------------------
// Orders (/v1/orders)
// ---------------------------------------------------------------------------

export type OrderType = "direct" | "pre_order";
export type FulfillmentType = "pickup" | "dine_in" | "pre_order";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled"
  | "rejected";

export interface OrderItem {
  id: string;
  menuItemId: string;
  menuItemName: string;
  quantity: number;
  unitPrice: number;
  notes: string | null;
  createdAt: string;
  menuItem: {
    id: string;
    customName: string | null;
    shortDescription: string | null;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  placeId: string;
  type: OrderType;
  fulfillmentType: FulfillmentType;
  status: OrderStatus;
  scheduledTime: string | null;
  subtotal: number;
  total: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  place: { id: string; name: string };
  items: OrderItem[];
}

export interface CreateOrderPayload {
  cartId: string;
  type: OrderType;
  fulfillmentType: FulfillmentType;
  scheduledTime?: string;
  notes?: string;
}

export interface OrdersListResponse {
  data: Order[];
}

export interface ReorderResponse {
  data: { cartId: string; itemCount: number };
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface TimeSlotsResponse {
  data: { date: string; slots: TimeSlot[] };
}
