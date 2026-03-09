'use client';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Category, Transaction } from '@/types';
import { formatCurrency, getCategoryById } from '@/lib/utils';

interface SpendingDonutProps {
  transactions: Transaction[];
  categories: Category[];
  month: string;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const { name, value, icon } = payload[0].payload;
  return (
    <div className="custom-tooltip">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-xs font-medium text-[var(--text-primary)]">{name}</span>
      </div>
      <p className="font-numeric text-sm font-semibold text-[var(--text-primary)] mt-1">{formatCurrency(value)}</p>
    </div>
  );
};

export default function SpendingDonut({ transactions, categories, month }: SpendingDonutProps) {
  const expenses = transactions.filter(t => t.type === 'expense' && t.date.startsWith(month));
  
  const byCategory: Record<string, number> = {};
  expenses.forEach(t => {
    byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount;
  });

  const data = Object.entries(byCategory)
    .map(([catId, value]) => {
      const cat = getCategoryById(categories, catId);
      return { name: cat?.name || catId, value, color: cat?.color || '#888', icon: cat?.icon || '•' };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="card p-5 transition-theme flex flex-col items-center justify-center min-h-[220px]">
        <div className="text-3xl mb-2">🧾</div>
        <p className="text-sm text-[var(--text-muted)]">No expense data this month</p>
      </div>
    );
  }

  return (
    <div className="card p-5 transition-theme">
      <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Spending Breakdown</h2>
      <div className="flex gap-4 items-center">
        <div className="relative h-36 w-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-numeric text-xs font-medium text-[var(--text-primary)]">{formatCurrency(total, true)}</span>
            <span className="text-[9px] text-[var(--text-muted)]">total</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-hidden">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-sm">{d.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-xs text-[var(--text-secondary)] truncate">{d.name}</span>
                  <span className="font-numeric text-xs font-medium text-[var(--text-primary)] ml-2 flex-shrink-0">
                    {Math.round((d.value / total) * 100)}%
                  </span>
                </div>
                <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full progress-bar"
                    style={{ width: `${(d.value / total) * 100}%`, background: d.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
