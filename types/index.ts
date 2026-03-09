export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | 'both';
  isCustom?: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  date: string; // ISO string
  type: TransactionType;
}

export interface Budget {
  categoryId: string;
  limit: number;
  month: string; // YYYY-MM
}

export interface MonthSummary {
  month: string; // YYYY-MM
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: Record<string, number>;
}

export type BalanceHealth = 'critical' | 'warning' | 'good' | 'excellent';

export function getBalanceHealth(balance: number, income: number): BalanceHealth {
  if (income === 0) return 'good';
  const ratio = balance / income;
  if (ratio < 0.1) return 'critical';
  if (ratio < 0.25) return 'warning';
  if (ratio < 0.5) return 'good';
  return 'excellent';
}

export function getBalanceColor(health: BalanceHealth): string {
  switch (health) {
    case 'critical': return 'text-red-500 dark:text-red-400';
    case 'warning': return 'text-amber-500 dark:text-amber-400';
    case 'good': return 'text-emerald-500 dark:text-emerald-400';
    case 'excellent': return 'text-teal-500 dark:text-teal-400';
  }
}

export function getBalanceBg(health: BalanceHealth): string {
  switch (health) {
    case 'critical': return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800';
    case 'warning': return 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800';
    case 'good': return 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800';
    case 'excellent': return 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800';
  }
}
