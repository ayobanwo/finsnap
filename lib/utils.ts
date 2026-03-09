import { Transaction, MonthSummary, Category } from '@/types';
import { format, parseISO, startOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD',
      notation: 'compact', maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 2,
  }).format(amount);
}

export function getMonthSummary(
  transactions: Transaction[],
  month: string,
): MonthSummary {
  const monthTx = transactions.filter(t => t.date.startsWith(month));
  const totalIncome = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const byCategory: Record<string, number> = {};
  monthTx.forEach(t => {
    byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount;
  });
  return { month, totalIncome, totalExpenses, balance: totalIncome - totalExpenses, byCategory };
}

export function getLast6MonthsSummaries(transactions: Transaction[]): MonthSummary[] {
  const now = new Date();
  const months = eachMonthOfInterval({
    start: subMonths(startOfMonth(now), 5),
    end: startOfMonth(now),
  });
  return months.map(m => getMonthSummary(transactions, format(m, 'yyyy-MM')));
}

export function getCategoryById(categories: Category[], id: string): Category | undefined {
  return categories.find(c => c.id === id);
}

export function formatMonth(month: string): string {
  try {
    return format(parseISO(month + '-01'), 'MMM yyyy');
  } catch {
    return month;
  }
}

export function formatShortMonth(month: string): string {
  try {
    return format(parseISO(month + '-01'), 'MMM');
  } catch {
    return month;
  }
}
