import { apiRequest, buildQuery } from "./client";
import type { PlaceDetail, PlacesQuery, PlacesResponse } from "./types";

export const placesApi = {
  getPlaces: (query: PlacesQuery = {}) =>
    apiRequest<PlacesResponse>(
      `/v1/places/places${buildQuery(query as Record<string, unknown>)}`,
    ),

  getPlace: (id: string) => apiRequest<PlaceDetail>(`/v1/places/places/${id}`),
};
