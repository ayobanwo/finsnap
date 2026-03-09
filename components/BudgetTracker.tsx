'use client';
import { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Budget, Category, Transaction } from '@/types';
import { formatCurrency, getCategoryById } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface BudgetTrackerProps {
  budgets: Budget[];
  categories: Category[];
  transactions: Transaction[];
  month: string;
  onSetBudget: (b: Budget) => void;
  onDeleteBudget: (categoryId: string, month: string) => void;
}

export default function BudgetTracker({ budgets, categories, transactions, month, onSetBudget, onDeleteBudget }: BudgetTrackerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [adding, setAdding] = useState(false);
  const [newCatId, setNewCatId] = useState('');
  const [newLimit, setNewLimit] = useState('');

  const monthBudgets = budgets.filter(b => b.month === month);
  const expenseCategories = categories.filter(c => c.type === 'expense' || c.type === 'both');

  const getSpent = (categoryId: string) =>
    transactions.filter(t => t.type === 'expense' && t.date.startsWith(month) && t.categoryId === categoryId)
      .reduce((s, t) => s + t.amount, 0);

  const unbudgetedCats = expenseCategories.filter(c => !monthBudgets.find(b => b.categoryId === c.id));

  const handleEdit = (b: Budget) => {
    setEditingId(b.categoryId);
    setEditValue(String(b.limit));
  };

  const handleSaveEdit = (categoryId: string) => {
    const limit = parseFloat(editValue);
    if (!isNaN(limit) && limit > 0) {
      onSetBudget({ categoryId, limit, month });
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleAdd = () => {
    const limit = parseFloat(newLimit);
    if (newCatId && !isNaN(limit) && limit > 0) {
      onSetBudget({ categoryId: newCatId, limit, month });
      setNewCatId('');
      setNewLimit('');
      setAdding(false);
    }
  };

  return (
    <div className="card p-5 transition-theme">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Budget Tracker</h2>
        {!adding && unbudgetedCats.length > 0 && (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add budget
          </button>
        )}
      </div>

      {adding && (
        <div className="flex gap-2 mb-3 animate-slide-up">
          <select
            value={newCatId}
            onChange={e => setNewCatId(e.target.value)}
            className="flex-1 text-xs px-2.5 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] outline-none focus:border-[var(--text-muted)]"
          >
            <option value="">Category...</option>
            {unbudgetedCats.map(c => (
              <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Limit $"
            value={newLimit}
            onChange={e => setNewLimit(e.target.value)}
            className="w-24 text-xs px-2.5 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] outline-none focus:border-[var(--text-muted)] font-numeric"
          />
          <button onClick={handleAdd} className="p-2 rounded-lg bg-[var(--text-primary)] text-[var(--surface)]">
            <Check className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setAdding(false)} className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)]">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {monthBudgets.length === 0 && !adding && (
        <div className="text-center py-6">
          <p className="text-sm text-[var(--text-muted)]">No budgets set for this month</p>
          <button onClick={() => setAdding(true)} className="mt-2 text-xs text-[var(--text-secondary)] underline">
            Set your first budget
          </button>
        </div>
      )}

      <div className="space-y-3">
        {monthBudgets.map(budget => {
          const cat = getCategoryById(categories, budget.categoryId);
          const spent = getSpent(budget.categoryId);
          const pct = Math.min((spent / budget.limit) * 100, 100);
          const over = spent > budget.limit;
          const warn = spent > budget.limit * 0.8;

          return (
            <div key={budget.categoryId} className="group">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-sm">{cat?.icon || '•'}</span>
                <span className="text-xs font-medium text-[var(--text-primary)] flex-1">{cat?.name || budget.categoryId}</span>

                {editingId === budget.categoryId ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      className="w-20 text-xs px-2 py-1 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] outline-none font-numeric"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && handleSaveEdit(budget.categoryId)}
                    />
                    <button onClick={() => handleSaveEdit(budget.categoryId)} className="p-1 text-emerald-600"><Check className="w-3 h-3" /></button>
                    <button onClick={() => setEditingId(null)} className="p-1 text-[var(--text-muted)]"><X className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className={cn('font-numeric text-xs font-medium', over ? 'text-red-500' : warn ? 'text-amber-500' : 'text-[var(--text-secondary)]')}>
                      {formatCurrency(spent)} / {formatCurrency(budget.limit)}
                    </span>
                    <button onClick={() => handleEdit(budget)} className="opacity-0 group-hover:opacity-100 p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all">
                      <Edit2 className="w-2.5 h-2.5" />
                    </button>
                    <button onClick={() => onDeleteBudget(budget.categoryId, month)} className="opacity-0 group-hover:opacity-100 p-0.5 text-[var(--text-muted)] hover:text-red-500 transition-all">
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full progress-bar transition-all', {
                    'bg-red-500': over,
                    'bg-amber-400': !over && warn,
                    'bg-emerald-500': !over && !warn,
                  })}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {over && (
                <p className="text-[10px] text-red-500 mt-0.5">
                  Over by {formatCurrency(spent - budget.limit)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
