import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSafePersistStorage } from "@/lib/safe-persist-storage";
import { slugifyBusinessName } from "@/lib/business-place-bridge";
import type { PromoType } from "@/lib/data/mock-data";

export type BusinessMenuItem = {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceRaw: number;
  image: string;
  category: string;
};

export type BusinessPromo = {
  id: string;
  title: string;
  description: string;
  promoType: PromoType;
  status: "Active" | "Upcoming" | "Ended";
  image: string;
  includedItemIds: string[];
};

export interface BusinessProfile {
  id: string;
  placeSlug: string;
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  logoUrl: string;
  bannerUrl: string;
  hours: Record<string, { open: string; close: string; closed?: boolean }>;
  sameAs: string[];
  menuItems: BusinessMenuItem[];
  promos: BusinessPromo[];
  createdAt: string;
}

export interface BusinessOnboardingDraft {
  name: string;
  category: string;
  description: string;
  address: string;
  phone: string;
  website: string;
  instagram: string;
  facebook: string;
  logoUrl: string;
  bannerUrl: string;
  hours: Record<string, { open: string; close: string; closed?: boolean }>;
  sameAs: string[];
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
  updateProfile: (patch: Partial<BusinessProfile>) => void;
  addMenuItem: (item: Omit<BusinessMenuItem, "id">) => void;
  removeMenuItem: (id: string) => void;
  addPromo: (promo: Omit<BusinessPromo, "id">) => void;
  removePromo: (id: string) => void;
  updatePromoStatus: (id: string, status: BusinessPromo["status"]) => void;
}

const emptyDraft: BusinessOnboardingDraft = {
  name: "",
  category: "",
  description: "",
  address: "",
  phone: "",
  website: "",
  instagram: "",
  facebook: "",
  logoUrl: "",
  bannerUrl: "",
  hours: defaultHours,
  sameAs: [],
  step: 0,
};

function normalizePersistedProfile(
  profile: BusinessProfile | null,
): BusinessProfile | null {
  if (!profile) return null;
  return {
    ...profile,
    placeSlug: profile.placeSlug ?? slugifyBusinessName(profile.name),
    sameAs: profile.sameAs ?? [],
    menuItems: profile.menuItems ?? [],
    promos: profile.promos ?? [],
  };
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      profile: null,
      draft: emptyDraft,

      setDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),

      resetDraft: () => set({ draft: emptyDraft }),

      completeOnboarding: () => {
        const { draft } = get();
        const sameAs = [draft.instagram, draft.facebook]
          .map((url) => url.trim())
          .filter(Boolean);
        const profile: BusinessProfile = {
          id: `biz-${Date.now()}`,
          placeSlug: slugifyBusinessName(draft.name),
          name: draft.name,
          category: draft.category,
          description: draft.description,
          address: draft.address,
          phone: draft.phone,
          website: draft.website,
          logoUrl: draft.logoUrl,
          bannerUrl: draft.bannerUrl,
          hours: draft.hours,
          sameAs,
          menuItems: [],
          promos: [],
          createdAt: new Date().toISOString(),
        };
        set({ profile, draft: emptyDraft });
        return profile;
      },

      clearProfile: () => set({ profile: null, draft: emptyDraft }),

      updateProfile: (patch) => {
        const { profile } = get();
        if (!profile) return;
        set({ profile: { ...profile, ...patch } });
      },

      addMenuItem: (item) => {
        const { profile } = get();
        if (!profile) return;
        set({
          profile: {
            ...profile,
            menuItems: [
              { ...item, id: `menu-${Date.now()}` },
              ...profile.menuItems,
            ],
          },
        });
      },

      removeMenuItem: (id) => {
        const { profile } = get();
        if (!profile) return;
        set({
          profile: {
            ...profile,
            menuItems: profile.menuItems.filter((item) => item.id !== id),
            promos: profile.promos.map((promo) => ({
              ...promo,
              includedItemIds: promo.includedItemIds.filter((itemId) => itemId !== id),
            })),
          },
        });
      },

      addPromo: (promo) => {
        const { profile } = get();
        if (!profile) return;
        set({
          profile: {
            ...profile,
            promos: [{ ...promo, id: `promo-${Date.now()}` }, ...profile.promos],
          },
        });
      },

      removePromo: (id) => {
        const { profile } = get();
        if (!profile) return;
        set({
          profile: {
            ...profile,
            promos: profile.promos.filter((promo) => promo.id !== id),
          },
        });
      },

      updatePromoStatus: (id, status) => {
        const { profile } = get();
        if (!profile) return;
        set({
          profile: {
            ...profile,
            promos: profile.promos.map((promo) =>
              promo.id === id ? { ...promo, status } : promo,
            ),
          },
        });
      },
    }),
    {
      name: "@hano/business",
      storage: createSafePersistStorage(),
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<BusinessState>) };
        return {
          ...merged,
          profile: normalizePersistedProfile(merged.profile),
        };
      },
    },
  ),
);

export { defaultHours };
