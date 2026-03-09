# FinSnap - Personal Finance Tracker

A polished personal finance tracker built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open http://localhost:3000
```

## 🏗️ Project Structure

```
finance-app/
├── app/
│   ├── globals.css        # Design tokens (CSS variables), typography, base styles
│   ├── layout.tsx         # Root layout with dark mode script injection
│   └── page.tsx           # Main dashboard page
│
├── components/
│   ├── Header.tsx          # Nav bar with dark/light toggle + settings
│   ├── SummaryCards.tsx    # Income / Expenses / Balance cards (health-colored)
│   ├── MonthlyBarChart.tsx # 6-month bar chart — click bar to drill into month
│   ├── SpendingDonut.tsx   # Donut chart + horizontal bar breakdown
│   ├── BudgetTracker.tsx   # Set/edit/delete budget limits with progress bars
│   ├── TransactionList.tsx # Filterable, searchable transaction list with delete
│   ├── AddTransactionModal.tsx # Smooth modal for adding income/expense
│   ├── SettingsModal.tsx   # Category management + data clearing
│   └── MonthSelector.tsx  # Month navigation tabs
│
├── hooks/
│   └── useFinanceStore.ts  # All state + localStorage persistence
│
├── lib/
│   ├── data.ts             # Default categories, seed data generator
│   └── utils.ts            # formatCurrency, getMonthSummary, cn helpers
│
├── types/
│   └── index.ts            # TypeScript interfaces + balance health logic
│
├── tailwind.config.js      # Custom tokens, animations, dark mode config
└── package.json
```

## 🎨 Design Decisions

### Color System
- CSS variables for seamless dark/light theme switching
- **Balance health colors**: 
  - 🔴 Red = <10% savings rate (critical)
  - 🟡 Amber = 10-25% savings rate (warning)
  - 🟢 Emerald = 25-50% savings rate (good)
  - 🩵 Teal = >50% savings rate (excellent)

### Typography
- **DM Sans** — clean, modern body font (not overused like Inter)
- **DM Mono** — monospace for all numbers (tabular, scannable)
- **Playfair Display** — display font imported but available for headers

### UX Highlights
- **Click a bar chart column** → instantly jumps to that month's detail view
- **Double-click to delete** a transaction (confirm protection)
- **Inline budget editing** without leaving the view
- **Auto-seeded** with 6 months of realistic demo data on first load
- **Keyboard shortcuts** in modals: Enter to submit, Escape to close
- **Theme persists** across sessions via localStorage + flash prevention script

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `recharts` | Bar chart + Donut pie chart |
| `date-fns` | Date formatting and month math |
| `lucide-react` | Icons |
| `clsx` + `tailwind-merge` | Conditional class merging |

## 💾 Data Persistence

All data lives in `localStorage` under these keys:
- `pfs_transactions` — array of Transaction objects
- `pfs_categories` — array of Category objects
- `pfs_budgets` — array of Budget objects
- `pfs_seeded` — flag to prevent re-seeding on reload
- `pfs_theme` — light/dark preference

No backend required. Data survives browser refreshes.

## 🔧 Customization

**Add default categories** → edit `DEFAULT_CATEGORIES` in `lib/data.ts`  
**Change currency** → update `formatCurrency()` in `lib/utils.ts`  
**Adjust balance health thresholds** → edit `getBalanceHealth()` in `types/index.ts`  
**Tweak chart colors** → edit `fill` props in `MonthlyBarChart.tsx`

## 🚢 Production Build

```bash
npm run build
npm start
```
