export type TransactionCategory = 'Electronics' | 'Clothing' | 'Food' | 'Home' | 'Other';
export type TransactionStatus = 'Completed' | 'Pending' | 'Cancelled';

export interface Transaction {
  id: string;
  customer: string;
  product: string;
  category: TransactionCategory;
  amount: number;
  date: string;
  status: TransactionStatus;
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  iconName: 'dollar-sign' | 'shopping-bag' | 'users' | 'trending-up';
}

export interface DailyRevenue {
  date: string;
  dayName: string;
  revenue: number;
  orders: number;
}
