'use client';
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';

import Header from '@/components/Header';
import SummaryCards from '@/components/SummaryCards';
import MonthlyBarChart from '@/components/MonthlyBarChart';
import SpendingDonut from '@/components/SpendingDonut';
import BudgetTracker from '@/components/BudgetTracker';
import TransactionList from '@/components/TransactionList';
import AddTransactionModal from '@/components/AddTransactionModal';
import SettingsModal from '@/components/SettingsModal';
import MonthSelector from '@/components/MonthSelector';

import { useFinanceStore } from '@/hooks/useFinanceStore';
import { getLast6MonthsSummaries, getMonthSummary, formatMonth } from '@/lib/utils';

export default function Home() {
    const store = useFinanceStore();
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const summaries = useMemo(
        () => getLast6MonthsSummaries(store.transactions),
        [store.transactions]
    );

    const monthSummary = useMemo(
        () => getMonthSummary(store.transactions, selectedMonth),
        [store.transactions, selectedMonth]
    );

    const months = summaries.map(s => s.month);

    if (!store.isLoaded) {
        return (
            <div className="min-h-screen bg-[var(--surface)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--border)] skeleton" />
                    <div className="h-4 w-32 rounded skeleton" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--surface)]">
            <Header onSettingsClick={() => setShowSettings(true)} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
                {/* Month navigation + Add button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                            {formatMonth(selectedMonth)}
                        </h1>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5">Personal finance overview</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block">
                            <MonthSelector months={months} selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--text-primary)] text-[var(--surface)] text-sm font-medium hover:opacity-90 active:scale-95 transition-all shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                        </button>
                    </div>
                </div>

                {/* Mobile month selector */}
                <div className="sm:hidden overflow-x-auto -mx-4 px-4">
                    <MonthSelector months={months} selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
                </div>

                {/* Summary cards */}
                <SummaryCards summary={monthSummary} />

                {/* Bar chart - full width */}
                <MonthlyBarChart
                    summaries={summaries}
                    selectedMonth={selectedMonth}
                    onSelectMonth={setSelectedMonth}
                />

                {/* Bottom grid: donut + budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <SpendingDonut
                        transactions={store.transactions}
                        categories={store.categories}
                        month={selectedMonth}
                    />
                    <BudgetTracker
                        budgets={store.budgets}
                        categories={store.categories}
                        transactions={store.transactions}
                        month={selectedMonth}
                        onSetBudget={store.setBudget}
                        onDeleteBudget={store.deleteBudget}
                    />
                </div>

                {/* Transactions list */}
                <TransactionList
                    transactions={store.transactions}
                    categories={store.categories}
                    month={selectedMonth}
                    onDelete={store.deleteTransaction}
                />
            </main>

            <AddTransactionModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={store.addTransaction}
                categories={store.categories}
                defaultMonth={selectedMonth}
            />

            <SettingsModal
                open={showSettings}
                onClose={() => setShowSettings(false)}
                categories={store.categories}
                onAddCategory={store.addCategory}
                onDeleteCategory={store.deleteCategory}
                onClearData={store.clearAllData}
            />
        </div>
    );
}
