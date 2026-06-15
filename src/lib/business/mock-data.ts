export interface BusinessKpi {
  label: string;
  value: string;
  trend: number;
  subStats: { label: string; value: string }[];
}

export interface ChartPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAvatar: string;
  timeAgo: string;
}

export interface OperationOrder {
  id: string;
  orderNumber: string;
  customer: string;
  type: "Dine in" | "Reservation" | "Pickup";
  status: "Pending" | "Preparing" | "Ready" | "Completed";
  total: number;
  time: string;
}

export const BUSINESS_KPIS: BusinessKpi[] = [
  {
    label: "Total Revenue",
    value: "RWF 2,450,000",
    trend: 23.4,
    subStats: [
      { label: "Orders", value: "332" },
      { label: "Avg Order", value: "RWF 7,164" },
    ],
  },
  {
    label: "Orders Received",
    value: "342",
    trend: -23.4,
    subStats: [
      { label: "Completed", value: "318" },
      { label: "Cancelled", value: "24" },
    ],
  },
  {
    label: "Menu Performance Index",
    value: "87.4",
    trend: 23.4,
    subStats: [
      { label: "This month", value: "+4.8" },
      { label: "Top Item", value: "Bacon Supreme Burger" },
    ],
  },
];

export const REVENUE_CHART: ChartPoint[] = [
  { month: "Jan", revenue: 180000, orders: 120 },
  { month: "Feb", revenue: 220000, orders: 145 },
  { month: "Mar", revenue: 260000, orders: 168 },
  { month: "Apr", revenue: 310000, orders: 190 },
  { month: "May", revenue: 380000, orders: 220 },
  { month: "Jun", revenue: 420000, orders: 250 },
  { month: "Jul", revenue: 540000, orders: 310 },
  { month: "Aug", revenue: 480000, orders: 280 },
  { month: "Sep", revenue: 450000, orders: 265 },
  { month: "Oct", revenue: 520000, orders: 295 },
  { month: "Nov", revenue: 580000, orders: 320 },
  { month: "Dec", revenue: 620000, orders: 340 },
];

export const SATISFACTION_CHART = [
  { month: "Jan", score: 4.2 },
  { month: "Feb", score: 4.3 },
  { month: "Mar", score: 4.4 },
  { month: "Apr", score: 4.5 },
  { month: "May", score: 4.6 },
  { month: "Jun", score: 4.7 },
];

export const ORDERS_BY_CATEGORY = [
  { name: "Dine in", value: 46, color: "#001814" },
  { name: "Reservation", value: 32, color: "#c8ff62" },
  { name: "Pickups", value: 22, color: "#b6e859" },
];

export const RECENT_ORDERS: RecentOrder[] = [
  { id: "1", orderNumber: "#23154", customerName: "Alice M.", customerAvatar: "https://i.pravatar.cc/40?img=1", timeAgo: "12mins ago" },
  { id: "2", orderNumber: "#23153", customerName: "Jean P.", customerAvatar: "https://i.pravatar.cc/40?img=2", timeAgo: "25mins ago" },
  { id: "3", orderNumber: "#23152", customerName: "Sarah K.", customerAvatar: "https://i.pravatar.cc/40?img=3", timeAgo: "38mins ago" },
  { id: "4", orderNumber: "#23151", customerName: "David R.", customerAvatar: "https://i.pravatar.cc/40?img=4", timeAgo: "1h ago" },
];

export const OPERATIONS_ORDERS: OperationOrder[] = [
  { id: "1", orderNumber: "#23154", customer: "Alice M.", type: "Dine in", status: "Pending", total: 8500, time: "12:30" },
  { id: "2", orderNumber: "#23153", customer: "Jean P.", type: "Reservation", status: "Preparing", total: 12000, time: "12:15" },
  { id: "3", orderNumber: "#23152", customer: "Sarah K.", type: "Pickup", status: "Ready", total: 4500, time: "12:00" },
  { id: "4", orderNumber: "#23151", customer: "David R.", type: "Dine in", status: "Completed", total: 9800, time: "11:45" },
  { id: "5", orderNumber: "#23150", customer: "Grace N.", type: "Reservation", status: "Pending", total: 15000, time: "11:30" },
];

export const TODAY_GOAL = { current: 48, target: 80 };
