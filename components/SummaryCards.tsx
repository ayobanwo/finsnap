'use client';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { MonthSummary, getBalanceHealth, getBalanceColor, getBalanceBg } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { formatMonth } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface SummaryCardsProps {
  summary: MonthSummary;
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const health = getBalanceHealth(summary.balance, summary.totalIncome);
  const balanceColor = getBalanceColor(health);
  const balanceBg = getBalanceBg(health);
  const savingsRate = summary.totalIncome > 0
    ? Math.round((summary.balance / summary.totalIncome) * 100)
    : 0;

  const healthLabel = { critical: 'Critical', warning: 'Watch out', good: 'On track', excellent: 'Healthy' }[health];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Income */}
      <div className="card p-5 transition-theme">
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Total Income</div>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div className="font-numeric text-2xl font-medium text-[var(--text-primary)] tabular-nums">
          {formatCurrency(summary.totalIncome)}
        </div>
        <div className="text-xs text-[var(--text-muted)] mt-1">{formatMonth(summary.month)}</div>
      </div>

      {/* Expenses */}
      <div className="card p-5 transition-theme">
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Total Expenses</div>
          <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center">
            <ArrowDownRight className="w-4 h-4 text-red-500 dark:text-red-400" />
          </div>
        </div>
        <div className="font-numeric text-2xl font-medium text-[var(--text-primary)] tabular-nums">
          {formatCurrency(summary.totalExpenses)}
        </div>
        <div className="text-xs text-[var(--text-muted)] mt-1">{formatMonth(summary.month)}</div>
      </div>

      {/* Balance */}
      <div className={cn('card p-5 border transition-theme', balanceBg)}>
        <div className="flex items-start justify-between mb-3">
          <div className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Balance</div>
          <div className="flex items-center gap-1.5">
            <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', {
              'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300': health === 'critical',
              'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300': health === 'warning',
              'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300': health === 'good',
              'bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300': health === 'excellent',
            })}>
              {healthLabel}
            </span>
          </div>
        </div>
        <div className={cn('font-numeric text-2xl font-medium tabular-nums', balanceColor)}>
          {formatCurrency(summary.balance)}
        </div>
        <div className="text-xs text-[var(--text-muted)] mt-1">
          {savingsRate}% savings rate
        </div>
      </div>
    </div>
  );
}
