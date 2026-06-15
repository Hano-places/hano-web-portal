import {
  BUSINESS_KPIS,
  OPERATIONS_ORDERS,
  ORDERS_BY_CATEGORY,
  RECENT_ORDERS,
  REVENUE_CHART,
  SATISFACTION_CHART,
  TODAY_GOAL,
  type BusinessKpi,
  type ChartPoint,
  type OperationOrder,
  type RecentOrder,
} from "./mock-data";

export interface BusinessDashboardData {
  kpis: BusinessKpi[];
  revenueChart: ChartPoint[];
  satisfactionChart: typeof SATISFACTION_CHART;
  ordersByCategory: typeof ORDERS_BY_CATEGORY;
  recentOrders: RecentOrder[];
  todayGoal: typeof TODAY_GOAL;
  operationsCount: number;
}

const USE_MOCK = true;

export const businessApi = {
  async getDashboard(): Promise<BusinessDashboardData> {
    if (USE_MOCK) {
      return {
        kpis: BUSINESS_KPIS,
        revenueChart: REVENUE_CHART,
        satisfactionChart: SATISFACTION_CHART,
        ordersByCategory: ORDERS_BY_CATEGORY,
        recentOrders: RECENT_ORDERS,
        todayGoal: TODAY_GOAL,
        operationsCount: 12,
      };
    }
    // Future: fetch from /v1/business/dashboard
    throw new Error("Business API not available");
  },

  async getOperations(): Promise<OperationOrder[]> {
    if (USE_MOCK) return OPERATIONS_ORDERS;
    throw new Error("Business API not available");
  },
};
