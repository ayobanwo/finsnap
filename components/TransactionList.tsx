'use client';
import { useState } from 'react';
import { Trash2, Search, Filter } from 'lucide-react';
import { Transaction, Category } from '@/types';
import { formatCurrency, getCategoryById } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  month: string;
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, categories, month, onDelete }: TransactionListProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const monthTx = transactions
    .filter(t => t.date.startsWith(month))
    .filter(t => typeFilter === 'all' || t.type === typeFilter)
    .filter(t => {
      if (!search) return true;
      const cat = getCategoryById(categories, t.categoryId);
      return (
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        (cat?.name || '').toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="card transition-theme">
      <div className="p-5 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Transactions
            <span className="ml-2 text-xs font-normal text-[var(--text-muted)]">({monthTx.length})</span>
          </h2>
          <div className="flex items-center gap-1">
            {(['all', 'income', 'expense'] as const).map(f => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={cn(
                  'text-xs px-2.5 py-1 rounded-md transition-all capitalize',
                  typeFilter === f
                    ? 'bg-[var(--text-primary)] text-[var(--surface)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-light)]'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--text-secondary)] transition-colors"
          />
        </div>
      </div>

      <div className="divide-y divide-[var(--border)] max-h-96 overflow-y-auto">
        {monthTx.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--text-muted)]">No transactions found</p>
          </div>
        )}
        {monthTx.map(tx => {
          const cat = getCategoryById(categories, tx.categoryId);
          const isDeleting = confirmDelete === tx.id;
          return (
            <div
              key={tx.id}
              className={cn(
                'group flex items-center gap-3 px-5 py-3.5 transition-colors',
                isDeleting ? 'bg-red-50 dark:bg-red-950/20' : 'hover:bg-[var(--accent-light)]'
              )}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: cat?.color ? `${cat.color}20` : 'var(--border)' }}
              >
                {cat?.icon || '•'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                  {tx.description || cat?.name || 'Transaction'}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {cat?.name} · {format(parseISO(tx.date), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className={cn('font-numeric text-sm font-semibold', tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-primary)]')}>
                  {tx.type === 'income' ? '+' : '−'}{formatCurrency(tx.amount)}
                </p>
              </div>
              <button
                onClick={() => handleDelete(tx.id)}
                className={cn(
                  'ml-1 p-1.5 rounded-lg transition-all flex-shrink-0',
                  isDeleting
                    ? 'bg-red-500 text-white opacity-100'
                    : 'opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                )}
                title={isDeleting ? 'Click again to confirm' : 'Delete'}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
