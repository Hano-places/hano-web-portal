import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  logoUrl: string;
  bannerUrl: string;
  hours: Record<string, { open: string; close: string; closed?: boolean }>;
  createdAt: string;
}

export interface BusinessOnboardingDraft {
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  logoUrl: string;
  bannerUrl: string;
  hours: Record<string, { open: string; close: string; closed?: boolean }>;
  step: number;
}

const defaultHours = {
  monday: { open: "08:00", close: "22:00" },
  tuesday: { open: "08:00", close: "22:00" },
  wednesday: { open: "08:00", close: "22:00" },
  thursday: { open: "08:00", close: "22:00" },
  friday: { open: "08:00", close: "23:00" },
  saturday: { open: "09:00", close: "23:00" },
  sunday: { open: "10:00", close: "21:00" },
};

interface BusinessState {
  profile: BusinessProfile | null;
  draft: BusinessOnboardingDraft;

  setDraft: (patch: Partial<BusinessOnboardingDraft>) => void;
  resetDraft: () => void;
  completeOnboarding: () => BusinessProfile;
  clearProfile: () => void;
}

const emptyDraft: BusinessOnboardingDraft = {
  name: "",
  category: "",
  description: "",
  address: "",
  phone: "",
  website: "",
  logoUrl: "",
  bannerUrl: "",
  hours: defaultHours,
  step: 0,
};

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      profile: null,
      draft: emptyDraft,

      setDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),

      resetDraft: () => set({ draft: emptyDraft }),

      completeOnboarding: () => {
        const { draft } = get();
        const profile: BusinessProfile = {
          id: `biz-${Date.now()}`,
          name: draft.name,
          category: draft.category,
          description: draft.description,
          address: draft.address,
          phone: draft.phone,
          website: draft.website,
          logoUrl: draft.logoUrl,
          bannerUrl: draft.bannerUrl,
          hours: draft.hours,
          createdAt: new Date().toISOString(),
        };
        set({ profile, draft: emptyDraft });
        return profile;
      },

      clearProfile: () => set({ profile: null, draft: emptyDraft }),
    }),
    { name: "@hano/business" },
  ),
);

export { defaultHours };
