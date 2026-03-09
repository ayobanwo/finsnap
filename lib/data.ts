import { Category, Transaction, Budget } from '@/types';
import { format, subMonths, startOfMonth } from 'date-fns';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'salary', name: 'Salary', icon: '💼', color: '#10b981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#06b6d4', type: 'income' },
  { id: 'investments', name: 'Investments', icon: '📈', color: '#8b5cf6', type: 'income' },
  { id: 'other-income', name: 'Other Income', icon: '💰', color: '#f59e0b', type: 'income' },
  { id: 'housing', name: 'Housing', icon: '🏠', color: '#ef4444', type: 'expense' },
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: '#f97316', type: 'expense' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#3b82f6', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#a855f7', type: 'expense' },
  { id: 'health', name: 'Health', icon: '💊', color: '#ec4899', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#14b8a6', type: 'expense' },
  { id: 'utilities', name: 'Utilities', icon: '⚡', color: '#eab308', type: 'expense' },
  { id: 'education', name: 'Education', icon: '📚', color: '#6366f1', type: 'expense' },
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

export function generateSeedData(): { transactions: Transaction[]; budgets: Budget[] } {
  const transactions: Transaction[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(startOfMonth(now), i);
    const monthStr = format(monthDate, 'yyyy-MM');

    // Income
    transactions.push({
      id: generateId(), amount: randomBetween(3500, 5500), categoryId: 'salary',
      description: 'Monthly salary', date: format(monthDate, 'yyyy-MM-05'), type: 'income',
    });
    if (Math.random() > 0.4) {
      transactions.push({
        id: generateId(), amount: randomBetween(200, 800), categoryId: 'freelance',
        description: 'Client project', date: format(monthDate, 'yyyy-MM-15'), type: 'income',
      });
    }

    // Expenses
    transactions.push(
      { id: generateId(), amount: randomBetween(900, 1400), categoryId: 'housing', description: 'Rent', date: format(monthDate, 'yyyy-MM-01'), type: 'expense' },
      { id: generateId(), amount: randomBetween(150, 350), categoryId: 'food', description: 'Groceries', date: format(monthDate, 'yyyy-MM-08'), type: 'expense' },
      { id: generateId(), amount: randomBetween(80, 200), categoryId: 'food', description: 'Restaurants', date: format(monthDate, 'yyyy-MM-14'), type: 'expense' },
      { id: generateId(), amount: randomBetween(50, 150), categoryId: 'transport', description: 'Fuel', date: format(monthDate, 'yyyy-MM-10'), type: 'expense' },
      { id: generateId(), amount: randomBetween(30, 100), categoryId: 'entertainment', description: 'Streaming & subscriptions', date: format(monthDate, 'yyyy-MM-12'), type: 'expense' },
      { id: generateId(), amount: randomBetween(80, 200), categoryId: 'utilities', description: 'Electric & internet', date: format(monthDate, 'yyyy-MM-05'), type: 'expense' },
    );

    if (Math.random() > 0.5) {
      transactions.push({ id: generateId(), amount: randomBetween(40, 200), categoryId: 'health', description: 'Pharmacy / gym', date: format(monthDate, 'yyyy-MM-18'), type: 'expense' });
    }
    if (Math.random() > 0.6) {
      transactions.push({ id: generateId(), amount: randomBetween(50, 300), categoryId: 'shopping', description: 'Online shopping', date: format(monthDate, 'yyyy-MM-20'), type: 'expense' });
    }
  }

  const currentMonth = format(now, 'yyyy-MM');
  const budgets: Budget[] = [
    { categoryId: 'housing', limit: 1500, month: currentMonth },
    { categoryId: 'food', limit: 500, month: currentMonth },
    { categoryId: 'transport', limit: 200, month: currentMonth },
    { categoryId: 'entertainment', limit: 150, month: currentMonth },
    { categoryId: 'health', limit: 200, month: currentMonth },
    { categoryId: 'shopping', limit: 300, month: currentMonth },
    { categoryId: 'utilities', limit: 250, month: currentMonth },
  ];

  return { transactions, budgets };
}

export const ICON_OPTIONS = ['🏠', '🍽️', '🚗', '🎬', '💊', '🛍️', '⚡', '📚', '✈️', '🎮', '🐾', '👗', '🏋️', '☕', '🎵', '💼', '💻', '📈', '💰', '🎁', '🔧', '📱'];
export const COLOR_OPTIONS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'];
