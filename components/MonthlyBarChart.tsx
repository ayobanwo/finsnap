'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { MonthSummary } from '@/types';
import { formatCurrency, formatShortMonth } from '@/lib/utils';
import { format } from 'date-fns';

interface MonthlyBarChartProps {
  summaries: MonthSummary[];
  selectedMonth: string;
  onSelectMonth: (month: string) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 text-xs mb-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.color }} />
          <span className="text-[var(--text-secondary)] capitalize">{p.name}:</span>
          <span className="font-numeric font-medium text-[var(--text-primary)]">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function MonthlyBarChart({ summaries, selectedMonth, onSelectMonth }: MonthlyBarChartProps) {
  const data = summaries.map(s => ({
    month: formatShortMonth(s.month),
    monthKey: s.month,
    income: s.totalIncome,
    expenses: s.totalExpenses,
  }));

  const handleBarClick = (data: any) => {
    if (data?.activePayload?.[0]?.payload?.monthKey) {
      onSelectMonth(data.activePayload[0].payload.monthKey);
    }
  };

  return (
    <div className="card p-5 transition-theme">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">6-Month Overview</h2>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Click a bar to view month details</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-emerald-500" />Income</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-red-400" />Expenses</span>
        </div>
      </div>

      <div className="h-52 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="28%" onClick={handleBarClick} style={{ cursor: 'pointer' }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'var(--font-dm-sans)' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'var(--font-dm-mono)' }}
              tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--accent-light)', radius: 4 }} />
            <Bar dataKey="income" fill="#10b981" radius={[5, 5, 0, 0]} maxBarSize={36}>
              {data.map((entry) => (
                <Cell
                  key={entry.monthKey}
                  fill={entry.monthKey === selectedMonth ? '#059669' : '#10b981'}
                  opacity={entry.monthKey === selectedMonth ? 1 : 0.75}
                />
              ))}
            </Bar>
            <Bar dataKey="expenses" fill="#f87171" radius={[5, 5, 0, 0]} maxBarSize={36}>
              {data.map((entry) => (
                <Cell
                  key={entry.monthKey}
                  fill={entry.monthKey === selectedMonth ? '#ef4444' : '#f87171'}
                  opacity={entry.monthKey === selectedMonth ? 1 : 0.75}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
