import { apiRequest } from "./client";
import type { UserResponse } from "./types";

export interface UpdateProfilePayload {
  name?: string;
  image?: string;
  onboardingCompleted?: boolean;
}

export const usersApi = {
  getMe: () => apiRequest<UserResponse>("/v1/users/me"),

  updateProfile: (id: string, payload: UpdateProfilePayload) =>
    apiRequest<UserResponse>(`/v1/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
