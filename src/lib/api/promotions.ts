import { apiRequest } from "./client";
import type { PromotionsResponse } from "./types";

export const promotionsApi = {
  getPlacePromotions: (placeId: string) =>
    apiRequest<PromotionsResponse>(
      `/v1/promotions/places/${placeId}/promotions`,
    ),
};
