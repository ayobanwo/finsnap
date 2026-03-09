'use client';
import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, Budget } from '@/types';
import { DEFAULT_CATEGORIES, generateSeedData } from '@/lib/data';

interface FinanceStore {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  isLoaded: boolean;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (c: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  setBudget: (b: Budget) => void;
  deleteBudget: (categoryId: string, month: string) => void;
  clearAllData: () => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

const KEYS = {
  transactions: 'pfs_transactions',
  categories: 'pfs_categories',
  budgets: 'pfs_budgets',
  seeded: 'pfs_seeded',
};

export function useFinanceStore(): FinanceStore {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const seeded = localStorage.getItem(KEYS.seeded);
      if (!seeded) {
        const { transactions: seedTx, budgets: seedBudgets } = generateSeedData();
        localStorage.setItem(KEYS.transactions, JSON.stringify(seedTx));
        localStorage.setItem(KEYS.budgets, JSON.stringify(seedBudgets));
        localStorage.setItem(KEYS.categories, JSON.stringify(DEFAULT_CATEGORIES));
        localStorage.setItem(KEYS.seeded, '1');
        setTransactions(seedTx);
        setBudgets(seedBudgets);
        setCategories(DEFAULT_CATEGORIES);
      } else {
        const tx = localStorage.getItem(KEYS.transactions);
        const cats = localStorage.getItem(KEYS.categories);
        const bud = localStorage.getItem(KEYS.budgets);
        if (tx) setTransactions(JSON.parse(tx));
        if (cats) setCategories(JSON.parse(cats));
        if (bud) setBudgets(JSON.parse(bud));
      }
    } catch (e) {
      console.error('Storage error:', e);
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((key: string, value: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, 'id'>) => {
    setTransactions(prev => {
      const next = [{ ...t, id: generateId() }, ...prev];
      persist(KEYS.transactions, next);
      return next;
    });
  }, [persist]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => {
      const next = prev.filter(t => t.id !== id);
      persist(KEYS.transactions, next);
      return next;
    });
  }, [persist]);

  const addCategory = useCallback((c: Omit<Category, 'id'>) => {
    setCategories(prev => {
      const next = [...prev, { ...c, id: generateId(), isCustom: true }];
      persist(KEYS.categories, next);
      return next;
    });
  }, [persist]);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== id || !c.isCustom);
      persist(KEYS.categories, next);
      return next;
    });
  }, [persist]);

  const setBudget = useCallback((b: Budget) => {
    setBudgets(prev => {
      const next = prev.filter(x => !(x.categoryId === b.categoryId && x.month === b.month));
      next.push(b);
      persist(KEYS.budgets, next);
      return next;
    });
  }, [persist]);

  const deleteBudget = useCallback((categoryId: string, month: string) => {
    setBudgets(prev => {
      const next = prev.filter(x => !(x.categoryId === categoryId && x.month === month));
      persist(KEYS.budgets, next);
      return next;
    });
  }, [persist]);

  const clearAllData = useCallback(() => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    setTransactions([]);
    setCategories(DEFAULT_CATEGORIES);
    setBudgets([]);
  }, []);

  return { transactions, categories, budgets, isLoaded, addTransaction, deleteTransaction, addCategory, deleteCategory, setBudget, deleteBudget, clearAllData };
}
