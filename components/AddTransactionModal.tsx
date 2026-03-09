'use client';
import { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { Transaction, Category, TransactionType } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (t: Omit<Transaction, 'id'>) => void;
  categories: Category[];
  defaultMonth?: string;
}

export default function AddTransactionModal({ open, onClose, onAdd, categories, defaultMonth }: AddTransactionModalProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  const filteredCats = categories.filter(c => c.type === type || c.type === 'both');

  useEffect(() => {
    if (open) {
      setError('');
      setSuccess(false);
      setTimeout(() => amountRef.current?.focus(), 100);
      if (defaultMonth) {
        setDate(defaultMonth + '-' + format(new Date(), 'dd'));
      }
    }
  }, [open, defaultMonth]);

  useEffect(() => {
    if (filteredCats.length > 0 && !filteredCats.find(c => c.id === categoryId)) {
      setCategoryId(filteredCats[0].id);
    }
  }, [type, filteredCats.length]);

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) { setError('Please enter a valid amount'); return; }
    if (!categoryId) { setError('Please select a category'); return; }
    if (!date) { setError('Please select a date'); return; }

    onAdd({ type, amount: amt, categoryId, description: description.trim(), date });
    setSuccess(true);
    setTimeout(() => {
      setAmount('');
      setDescription('');
      setError('');
      setSuccess(false);
      onClose();
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onKeyDown={handleKeyDown}>
      <div className="modal-overlay absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[var(--surface-overlay)] rounded-2xl border border-[var(--border)] shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <h2 className="font-semibold text-[var(--text-primary)]">Add Transaction</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-light)] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Type toggle */}
          <div className="flex gap-2 p-1 bg-[var(--surface)] rounded-xl">
            {(['expense', 'income'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all capitalize',
                  type === t
                    ? t === 'expense'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-emerald-500 text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                )}
              >
                {t === 'expense' ? '↓ Expense' : '↑ Income'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Amount</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-numeric font-medium">$</span>
              <input
                ref={amountRef}
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => { setAmount(e.target.value); setError(''); }}
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] font-numeric text-lg outline-none focus:border-[var(--text-secondary)] transition-colors placeholder-[var(--text-muted)]"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Category</label>
            <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
              {filteredCats.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-2 rounded-xl border text-xs font-medium transition-all text-left',
                    categoryId === cat.id
                      ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--surface)]'
                      : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:bg-[var(--accent-light)]'
                  )}
                >
                  <span>{cat.icon}</span>
                  <span className="truncate">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description & Date in row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Description</label>
              <input
                type="text"
                placeholder="Optional note"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--text-secondary)] transition-colors placeholder-[var(--text-muted)]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] text-sm outline-none focus:border-[var(--text-secondary)] transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 animate-fade-in">{error}</p>
          )}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={handleSubmit}
            className={cn(
              'w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
              success
                ? 'bg-emerald-500 text-white'
                : type === 'expense'
                  ? 'bg-[var(--text-primary)] text-[var(--surface)] hover:opacity-90'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
            )}
          >
            {success ? (
              <><Check className="w-4 h-4" /> Added!</>
            ) : (
              `Add ${type}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
