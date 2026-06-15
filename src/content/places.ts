import { IMG } from "./images";
import type { WeeklyHours } from "@/lib/place-hours";

export type PlaceType =
  | "restaurant"
  | "cafe"
  | "bar"
  | "lounge"
  | "bistro"
  | "fine-dining"
  | "bakery";

export type PlaceFilter = "all" | PlaceType;

export type PlaceAddress = {
  street: string;
  locality: string;
  region: string;
  country: string;
};

export type PlaceGeo = {
  lat: number;
  lng: number;
};

export type PlaceReview = {
  author: string;
  rating: number;
  text: string;
  date?: string;
};

export type PlaceMenuItem = {
  name: string;
  description?: string;
  price?: string;
};

export type PlaceMenuSection = {
  name: string;
  items: readonly PlaceMenuItem[];
};

export type PlaceFAQ = {
  question: string;
  answer: string;
};

export type PlaceBase = {
  id: string;
  name: string;
  category: string;
  type: PlaceType;
  location: string;
  rating: number;
  priceRange: "$" | "$$" | "$$$" | "$$$$";
  description: string;
  image: (typeof IMG)[keyof typeof IMG];
  website?: string;
  tags: readonly string[];
  hours: WeeklyHours;
  featured?: boolean;
};

export type PlaceSeed = PlaceBase & {
  slug?: string;
  address?: Partial<PlaceAddress>;
  geo?: Partial<PlaceGeo>;
  phone?: string;
  reviews?: readonly PlaceReview[];
  menu?: readonly PlaceMenuSection[];
  faqs?: readonly PlaceFAQ[];
  gallery?: readonly string[];
  sameAs?: readonly string[];
  updatedAt?: string;
};

export type Place = PlaceBase & {
  slug: string;
  address: PlaceAddress;
  geo: PlaceGeo;
  phone?: string;
  reviews: readonly PlaceReview[];
  menu: readonly PlaceMenuSection[];
  faqs: readonly PlaceFAQ[];
  gallery: readonly string[];
  sameAs: readonly string[];
  updatedAt: string;
};

const daily = (hours: string): WeeklyHours => ({
  monday: hours,
  tuesday: hours,
  wednesday: hours,
  thursday: hours,
  friday: hours,
  saturday: hours,
  sunday: hours,
});

export const places: readonly PlaceSeed[] = [
  {
    id: "boho",
    name: "Boho",
    category: "Restaurant · Afro-fusion",
    type: "restaurant",
    location: "Kiyovu",
    rating: 4.9,
    priceRange: "$$",
    description:
      "Rooftop Afro-fusion dining, craft cocktails, and one of Kigali's best night views.",
    image: IMG.nightView,
    website: "https://www.boho.rw/",
    tags: ["rooftop", "cocktails", "afro-fusion", "nightlife"],
    featured: true,
    hours: {
      monday: "8 AM – 1 AM",
      tuesday: "8 AM – 1 AM",
      wednesday: "8 AM – 1 AM",
      thursday: "8 AM – 1 AM",
      friday: "8 AM – 2 AM",
      saturday: "8 AM – 2 AM",
      sunday: "8 AM – 2 AM",
    },
  },
  {
    id: "pili-pili",
    name: "Pili Pili",
    category: "Restaurant & Lounge",
    type: "lounge",
    location: "Kibagabaga",
    rating: 4.8,
    priceRange: "$$$",
    description:
      "Wood-fired pizza, sunset sessions, and poolside dining on the hills of Kigali.",
    image: IMG.outdoorDining,
    website: "https://www.pilipilirwanda.rw/",
    tags: ["pizza", "pool", "sunset", "lounge"],
    featured: true,
    hours: daily("11 AM – 11 PM"),
  },
  {
    id: "heaven",
    name: "Heaven Restaurant",
    category: "Restaurant · Modern African",
    type: "restaurant",
    location: "Kiyovu",
    rating: 4.8,
    priceRange: "$$$",
    description:
      "Panoramic city views with thoughtfully prepared local and international cuisine.",
    image: IMG.elegantTable,
    website: "https://heavenrwanda.com/",
    tags: ["views", "african", "hotel", "brunch"],
    featured: true,
    hours: daily("6:30 AM – 10 PM"),
  },
  {
    id: "casa-verde",
    name: "Casa Verde",
    category: "Café · Resto · Bar",
    type: "cafe",
    location: "Kiyovu",
    rating: 4.7,
    priceRange: "$$",
    description:
      "All-day café, restaurant, and bar with a relaxed garden setting in the city center.",
    image: IMG.modernCafe,
    website: "https://casaverde.rw/",
    tags: ["garden", "coffee", "bar", "all-day"],
    featured: true,
    hours: daily("7 AM – 11 PM"),
  },
  {
    id: "question-coffee",
    name: "Question Coffee",
    category: "Café · Specialty coffee",
    type: "cafe",
    location: "Gishushu",
    rating: 4.9,
    priceRange: "$$",
    description:
      "Farm-to-cup Rwandan specialty coffee from women-led cooperatives, plus barista training.",
    image: IMG.modernElegance,
    website: "https://www.questioncoffee.com/",
    tags: ["specialty coffee", "training", "women-led", "farm to cup"],
    featured: true,
    hours: {
      monday: "8 AM – 6 PM",
      tuesday: "8 AM – 6 PM",
      wednesday: "8 AM – 6 PM",
      thursday: "8 AM – 6 PM",
      friday: "8 AM – 6 PM",
      saturday: "9 AM – 5 PM",
      sunday: "9 AM – 5 PM",
    },
  },
  {
    id: "choose-kigali",
    name: "Choose Kigali",
    category: "Fine dining · Art gallery",
    type: "fine-dining",
    location: "Kiyovu",
    rating: 4.9,
    priceRange: "$$$$",
    description:
      "Rwanda's premiere art gallery paired with omakase tasting menus and guest chef residencies.",
    image: IMG.portrait,
    website: "https://www.choosekigali.com/",
    tags: ["art", "tasting menu", "wine", "omakase"],
    featured: true,
    hours: {
      monday: "Closed",
      tuesday: "6 PM – 11 PM",
      wednesday: "6 PM – 11 PM",
      thursday: "6 PM – 11 PM",
      friday: "6 PM – 11 PM",
      saturday: "6 PM – 11 PM",
      sunday: "Closed",
    },
  },
  {
    id: "peacock-cafe",
    name: "Peacock Cafe & Gardens",
    category: "Café · Garden restaurant",
    type: "cafe",
    location: "Kiyovu",
    rating: 4.8,
    priceRange: "$$$",
    description:
      "Coffee shop and garden restaurant in Kiyovu — calm greenery and refined plates.",
    image: IMG.aerial,
    website: "https://peacockgarden.net/",
    tags: ["garden", "coffee", "lunch", "healthy"],
    featured: true,
    hours: daily("8 AM – 10 PM"),
  },
  {
    id: "inzora",
    name: "Inzora Rooftop Café",
    category: "Café · Rooftop",
    type: "cafe",
    location: "Nyarutarama",
    rating: 4.8,
    priceRange: "$$",
    description:
      "Quiet rooftop café above Ikirezi Bookstore — coffee, light bites, and leafy views.",
    image: IMG.rooftop,
    tags: ["rooftop", "bookstore", "quiet", "vegetarian"],
    featured: true,
    hours: {
      monday: "8 AM – 6 PM",
      tuesday: "8 AM – 6 PM",
      wednesday: "8 AM – 6 PM",
      thursday: "8 AM – 6 PM",
      friday: "8 AM – 6 PM",
      saturday: "9 AM – 5 PM",
      sunday: "Closed",
    },
  },
  {
    id: "nyurah",
    name: "Nyurah",
    category: "Fine dining · Contemporary African",
    type: "fine-dining",
    location: "City Centre",
    rating: 4.9,
    priceRange: "$$$$",
    description:
      "Seasonal contemporary African cuisine in Alliance Towers — reservations recommended.",
    image: IMG.sophisticated,
    website: "https://www.nyurah.com/",
    tags: ["fine dining", "seasonal", "african", "vegan options"],
    hours: {
      monday: "Closed",
      tuesday: "12 PM – 3 PM, 6 PM – 11 PM",
      wednesday: "12 PM – 3 PM, 6 PM – 11 PM",
      thursday: "12 PM – 3 PM, 6 PM – 11 PM",
      friday: "12 PM – 3 PM, 6 PM – 11 PM",
      saturday: "6 PM – 11 PM",
      sunday: "Closed",
    },
  },
  {
    id: "lilly",
    name: "Lilly Fine Dining",
    category: "Fine dining",
    type: "fine-dining",
    location: "Kimihurura",
    rating: 4.9,
    priceRange: "$$$$",
    description:
      "Contemporary fine dining with seasonal menus and an intimate Kimihurura setting.",
    image: IMG.elegantTable,
    website: "https://lilly-rwanda.com/",
    tags: ["seasonal", "date night", "wine"],
    hours: {
      monday: "Closed",
      tuesday: "6 PM – 11 PM",
      wednesday: "6 PM – 11 PM",
      thursday: "6 PM – 11 PM",
      friday: "6 PM – 11 PM",
      saturday: "6 PM – 11 PM",
      sunday: "Closed",
    },
  },
  {
    id: "le-youkounkoun",
    name: "Le Youkounkoun",
    category: "Fine dining · African fusion",
    type: "fine-dining",
    location: "City Centre",
    rating: 4.8,
    priceRange: "$$$$",
    description:
      "Elevated African fusion at Simba Center — tasting menus and a polished dining room.",
    image: IMG.joyfulScene,
    website: "https://www.leyoukounkoun.rw/",
    tags: ["african fusion", "tasting menu", "simba center"],
    hours: {
      monday: "Closed",
      tuesday: "12 PM – 3 PM, 6 PM – 11 PM",
      wednesday: "12 PM – 3 PM, 6 PM – 11 PM",
      thursday: "12 PM – 3 PM, 6 PM – 11 PM",
      friday: "12 PM – 3 PM, 6 PM – 11 PM",
      saturday: "6 PM – 11 PM",
      sunday: "Closed",
    },
  },
  {
    id: "yt-burger",
    name: "Y&T Burger & Wine Bistro",
    category: "Restaurant · Burgers & wine",
    type: "restaurant",
    location: "Gishushu",
    rating: 4.7,
    priceRange: "$$",
    description:
      "Gourmet burgers, natural wines, and a lively bistro vibe in Gishushu.",
    image: IMG.gourmetBurger,
    website: "https://www.ytburger.com/",
    tags: ["burgers", "wine", "bistro"],
    hours: daily("11 AM – 11 PM"),
  },
  {
    id: "fayrouz",
    name: "Fayrouz",
    category: "Restaurant · Lebanese",
    type: "restaurant",
    location: "Kigali",
    rating: 4.7,
    priceRange: "$$",
    description:
      "Lebanese mezze, grills, and Middle Eastern flavors in a warm, social setting.",
    image: IMG.cozy,
    website: "https://fayrouz-africa.com/",
    tags: ["lebanese", "mezze", "middle eastern"],
    hours: daily("11 AM – 11 PM"),
  },
  {
    id: "repub-lounge",
    name: "Repub Lounge",
    category: "Restaurant · East African",
    type: "lounge",
    location: "Kimihurura",
    rating: 4.8,
    priceRange: "$$$",
    description:
      "Upscale East African cuisine across two floors — a Kimihurura institution since 2006.",
    image: IMG.tropical,
    website: "https://republounge.com/",
    tags: ["east african", "institution", "two floors"],
    hours: daily("12 PM – 10 PM"),
  },
  {
    id: "poivre-noir",
    name: "Poivre Noir",
    category: "Bistro · International",
    type: "bistro",
    location: "Kimihurura",
    rating: 4.7,
    priceRange: "$$$",
    description:
      "Contemporary bistro plates, wine pairings, and private dining in Kimihurura.",
    image: IMG.serene,
    website: "https://poivrenoirbistro.com/",
    tags: ["bistro", "wine", "private dining"],
    hours: {
      monday: "Closed",
      tuesday: "12 PM – 10 PM",
      wednesday: "12 PM – 10 PM",
      thursday: "12 PM – 10 PM",
      friday: "12 PM – 10 PM",
      saturday: "12 PM – 10 PM",
      sunday: "12 PM – 10 PM",
    },
  },
  {
    id: "meze-fresh",
    name: "Meze Fresh",
    category: "Restaurant · Mexican",
    type: "restaurant",
    location: "Kacyiru",
    rating: 4.6,
    priceRange: "$",
    description:
      "Kigali's original build-your-own burrito bar — tacos, bowls, and fast-casual Mexican.",
    image: IMG.burgers,
    tags: ["mexican", "burritos", "fast casual", "budget"],
    hours: {
      monday: "Closed",
      tuesday: "11 AM – 11 PM",
      wednesday: "11 AM – 11 PM",
      thursday: "11 AM – 11 PM",
      friday: "11 AM – 11 PM",
      saturday: "11 AM – 11 PM",
      sunday: "12 PM – 8 PM",
    },
  },
  {
    id: "brioche",
    name: "Brioche",
    category: "Bakery · Café bistro",
    type: "bakery",
    location: "Kacyiru",
    rating: 4.7,
    priceRange: "$$",
    description:
      "French-inspired pastries, breads, and espresso — multiple locations across Kigali.",
    image: IMG.creamyDrink,
    website: "https://www.briocherwanda.com/",
    tags: ["bakery", "pastries", "coffee", "breakfast", "brunch"],
    hours: daily("7 AM – 9 PM"),
  },
  {
    id: "pan-afrikan",
    name: "Kigali Pan-Afrikan Kitchen",
    category: "Restaurant · Pan-African",
    type: "restaurant",
    location: "City Centre",
    rating: 4.6,
    priceRange: "$$",
    description:
      "Pan-African plates celebrating regional flavors in a lively downtown setting.",
    image: IMG.pizzaInterior,
    tags: ["pan-african", "local", "downtown"],
    hours: daily("11 AM – 10 PM"),
  },
  {
    id: "habesha",
    name: "Habesha Ethiopian Restaurant",
    category: "Restaurant · Ethiopian",
    type: "restaurant",
    location: "Kiyovu",
    rating: 4.7,
    priceRange: "$$",
    description:
      "Traditional injera platters, coffee ceremony, and shared Ethiopian dining.",
    image: IMG.cozy,
    tags: ["ethiopian", "injera", "coffee ceremony", "shared plates"],
    hours: daily("11 AM – 10 PM"),
  },
  {
    id: "chomad",
    name: "Choma'd Bar & Grill",
    category: "Bar & grill · Nyama choma",
    type: "bar",
    location: "Gishushu",
    rating: 4.6,
    priceRange: "$$",
    description:
      "Grilled meats, cold drinks, and a casual after-work crowd near Kigali Heights.",
    image: IMG.beachDrink,
    tags: ["grill", "nyama choma", "after work", "casual"],
    hours: daily("12 PM – 11 PM"),
  },
  {
    id: "sole-luna",
    name: "Sole Luna",
    category: "Restaurant · Italian",
    type: "restaurant",
    location: "Kiyovu",
    rating: 4.7,
    priceRange: "$$$",
    description:
      "Wood-fired pizza, handmade pasta, and Italian wines in a cozy Kiyovu trattoria.",
    image: IMG.pizzaInterior,
    tags: ["italian", "pizza", "pasta", "wine"],
    hours: {
      monday: "Closed",
      tuesday: "12 PM – 11 PM",
      wednesday: "12 PM – 11 PM",
      thursday: "12 PM – 11 PM",
      friday: "12 PM – 11 PM",
      saturday: "12 PM – 11 PM",
      sunday: "12 PM – 11 PM",
    },
  },
  {
    id: "chess-cafe",
    name: "Chess Café",
    category: "Café · Games lounge",
    type: "cafe",
    location: "City Centre",
    rating: 4.5,
    priceRange: "$",
    description:
      "Relaxed café with board games, snacks, and coffee in the heart of downtown Kigali.",
    image: IMG.modernCafe,
    tags: ["games", "coffee", "casual", "downtown"],
    hours: daily("9 AM – 9 PM"),
  },
] as const;

export const placeFilters: { id: PlaceFilter; label: string }[] = [
  { id: "all", label: "All places" },
  { id: "restaurant", label: "Restaurants" },
  { id: "cafe", label: "Cafés" },
  { id: "fine-dining", label: "Fine dining" },
  { id: "bakery", label: "Bakeries" },
  { id: "lounge", label: "Lounges" },
  { id: "bar", label: "Bars & grills" },
  { id: "bistro", label: "Bistros" },
];

export function getFeaturedPlaces(): PlaceSeed[] {
  return places.filter((place) => place.featured);
}

export const placesPage = {
  title: "Explore Kigali",
  headline: "Restaurants, cafés & hidden gems",
  supporting:
    "Browse real spots across Kigali — search by name, neighborhood, or cuisine and see who's open now.",
  searchPlaceholder: "Search by name, area, or cuisine…",
  emptyState: "No places match your search. Try a different keyword or filter.",
} as const;
