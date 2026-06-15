import { apiRequest } from "./client";
import type { CategoriesResponse, Category } from "./types";

export const categoriesApi = {
  getCategories: () => apiRequest<CategoriesResponse>("/v1/categories/categories"),

  getCategory: (id: string) => apiRequest<Category>(`/v1/categories/categories/${id}`),
};
