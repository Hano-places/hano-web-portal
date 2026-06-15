export type MenuItem = {
  id: string;
  name: string;
  desc: string;
  price: string;
  priceRaw: number;
  orders: number;
  rating: number;
  image: string;
  category: string;
};

export type DishItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  priceRaw: number;
  orders: number;
  location: string;
  image: string;
};

export type PromoItem = {
  id: string;
  title: string;
  location: string;
  points: number;
  image: string;
};

export type WalletActivity = {
  id: string;
  title: string;
  amount: string;
  date: string;
  type: "credit" | "debit";
};

export const PLACE_MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    name: "Bacon Supreme Burger",
    desc: "Juicy grilled beef with crispy bacon and cheddar",
    price: "2,000 RWF",
    priceRaw: 2000,
    orders: 312,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    category: "Burgers",
  },
  {
    id: "2",
    name: "Classic Cheeseburger",
    desc: "Double patty with melted cheese and fresh veggies",
    price: "2,500 RWF",
    priceRaw: 2500,
    orders: 245,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
    category: "Burgers",
  },
  {
    id: "3",
    name: "Spicy Chicken Burger",
    desc: "Crispy fried chicken with spicy mayo and slaw",
    price: "2,000 RWF",
    priceRaw: 2000,
    orders: 189,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1606755962773-552769c4c8b4?w=400",
    category: "Burgers",
  },
  {
    id: "4",
    name: "Nyama Choma Platter",
    desc: "Grilled meat platter with sides",
    price: "4,500 RWF",
    priceRaw: 4500,
    orders: 312,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1529042410759-befb1204b916?w=400",
    category: "Grills",
  },
  {
    id: "5",
    name: "Cappuccino Deluxe",
    desc: "Rich espresso with steamed milk foam",
    price: "1,500 RWF",
    priceRaw: 1500,
    orders: 420,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    category: "Beverages",
  },
  {
    id: "6",
    name: "Grilled Tilapia",
    desc: "Fresh lake tilapia with lemon butter",
    price: "6,500 RWF",
    priceRaw: 6500,
    orders: 195,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1519708227411-c8fd9a32b4a2?w=400",
    category: "Seafood",
  },
];

export const TOP_DISHES: DishItem[] = PLACE_MENU_ITEMS.slice(0, 4).map((item) => ({
  id: item.id,
  name: item.name,
  category: item.category,
  price: item.price,
  priceRaw: item.priceRaw,
  orders: item.orders,
  location: "Kigali Grill House",
  image: item.image,
}));

export const HOT_PROMOS: PromoItem[] = [
  {
    id: "1",
    title: "Get 10% Off with Christmas Sales",
    location: "Kigali Grill House Restaurant",
    points: 250,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
  },
  {
    id: "2",
    title: "Free Coffee with Every Meal",
    location: "Bourbon Coffee Kacyiru",
    points: 150,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
  },
];

export const WALLET_ACTIVITIES: WalletActivity[] = [
  { id: "1", title: "Order at Boho Restaurant", amount: "-2,000 RWF", date: "2026-06-10", type: "debit" },
  { id: "2", title: "Reward points earned", amount: "+150 pts", date: "2026-06-09", type: "credit" },
];

export const PAYMENT_METHODS = [
  { id: "momo", name: "MTN MoMo", icon: "📱" },
  { id: "airtel", name: "Airtel Money", icon: "📲" },
  { id: "card", name: "Visa / Mastercard", icon: "💳" },
];

export const LOCATION_CATEGORIES = ["All", "Restaurants", "Cafés", "Lounges", "Bars"];

export const ONBOARDING_SLIDES = [
  { title: "Discover what's around you", desc: "Find the best restaurants, cafés, and lounges in Kigali." },
  { title: "Find dishes everyone loves", desc: "Browse top-rated dishes and trending spots." },
  { title: "Order before you arrive", desc: "Skip the wait with direct orders and pre-orders." },
  { title: "Welcome to Hano", desc: "Your guide to Kigali's hospitality scene." },
];
