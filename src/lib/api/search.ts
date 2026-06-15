import { apiRequest, buildQuery } from "./client";
import type { SearchQuery, SearchResult, SuggestionsResponse } from "./types";

export const searchApi = {
  search: (query: SearchQuery = {}) =>
    apiRequest<SearchResult>(
      `/v1/search/search${buildQuery(query as Record<string, unknown>)}`,
    ),

  getSuggestions: (q: string) =>
    apiRequest<SuggestionsResponse>(
      `/v1/search/search/suggestions?q=${encodeURIComponent(q)}`,
    ),
};
