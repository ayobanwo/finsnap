'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatMonth } from '@/lib/utils';
import { MonthSummary } from '@/types';
import { cn } from '@/lib/utils';

interface MonthSelectorProps {
  months: string[];
  selectedMonth: string;
  onSelect: (month: string) => void;
}

export default function MonthSelector({ months, selectedMonth, onSelect }: MonthSelectorProps) {
  const idx = months.indexOf(selectedMonth);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => idx > 0 && onSelect(months[idx - 1])}
        disabled={idx <= 0}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-light)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-1">
        {months.map(m => (
          <button
            key={m}
            onClick={() => onSelect(m)}
            className={cn(
              'px-2.5 py-1 rounded-lg text-xs transition-all',
              m === selectedMonth
                ? 'bg-[var(--text-primary)] text-[var(--surface)] font-medium'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-light)]'
            )}
          >
            {formatMonth(m).split(' ')[0]}
          </button>
        ))}
      </div>

      <button
        onClick={() => idx < months.length - 1 && onSelect(months[idx + 1])}
        disabled={idx >= months.length - 1}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-light)] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
