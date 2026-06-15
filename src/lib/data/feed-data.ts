import { IMG } from "@/content/images";
import { HOT_PROMOS } from "@/lib/data/mock-data";

export type FeedNotification = {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  type: "order" | "review" | "promo" | "system";
};

export type FeedPromo = {
  id: string;
  title: string;
  location: string;
  points: number;
  image: string;
};

export type MomentFeedItem = {
  id: string;
  image: string;
  place: string;
  author: string;
  likes: number;
};

export type HomeKpi = {
  label: string;
  value: string;
  change?: string;
};

export const NOTIFICATIONS: FeedNotification[] = [
  {
    id: "1",
    title: "Order ready for pickup",
    body: "Your order at Boho is ready. Head to the counter.",
    timeAgo: "5m ago",
    type: "order",
  },
  {
    id: "2",
    title: "New review on your moment",
    body: "Someone loved your photo at The Green Lounge.",
    timeAgo: "1h ago",
    type: "review",
  },
  {
    id: "3",
    title: "Weekend promo unlocked",
    body: "Get 10% off at Kigali Grill House this Saturday.",
    timeAgo: "3h ago",
    type: "promo",
  },
  {
    id: "4",
    title: "Welcome to Hano",
    body: "Explore places, order ahead, and share your moments.",
    timeAgo: "1d ago",
    type: "system",
  },
];

export const PROMOS: FeedPromo[] = HOT_PROMOS;

export const MOMENTS_FEED: MomentFeedItem[] = [
  { id: "1", image: IMG.joyfulScene, place: "Boho", author: "Aline M.", likes: 42 },
  { id: "2", image: IMG.modernCafe, place: "Bourbon Coffee", author: "Jean P.", likes: 28 },
  { id: "3", image: IMG.outdoorDining, place: "The Green Lounge", author: "Sarah K.", likes: 65 },
  { id: "4", image: IMG.gourmetBurger, place: "Kigali Grill House", author: "Eric N.", likes: 31 },
  { id: "5", image: IMG.elegantTable, place: "Heaven Restaurant", author: "Maya T.", likes: 19 },
  { id: "6", image: IMG.tropical, place: "Sundowner Bar", author: "David R.", likes: 54 },
  { id: "7", image: IMG.cozy, place: "Café Neo", author: "Grace U.", likes: 37 },
  { id: "8", image: IMG.sophisticated, place: "Fusion Bistro", author: "Kevin H.", likes: 22 },
  { id: "9", image: IMG.portrait, place: "Boho", author: "Linda W.", likes: 48 },
];

export const HOME_KPIS: HomeKpi[] = [
  { label: "Orders placed", value: "12", change: "+2 this week" },
  { label: "Places saved", value: "8", change: "3 new" },
  { label: "Moments shared", value: "24", change: "+5 this month" },
];
