💰 Finance Snapshot
Personal Finance Tracker — Technical README
Stack: Next.js 14  ·  TypeScript  ·  Tailwind CSS  ·  Recharts  ·  localStorage

1. What I Built
Finance Snapshot is a client-side personal finance dashboard that lets users track monthly income and expenses, visualise spending patterns, and set budgets — with zero backend required.

Core features delivered
•	6-month bar chart (click any bar to drill into that month's detail)
•	Income vs expense summary cards with dynamic health colouring — red / amber / green / teal
•	Donut chart + horizontal breakdown bars for per-category spending
•	Budget tracker — set limits, inline-edit, progress bars change colour as you approach or exceed budget
•	Add transaction modal — type toggle, category grid, keyboard shortcuts (Enter / Escape)
•	Category management — add custom categories with icon picker, colour picker, and income/expense type
•	Light / dark mode — flash-free (theme script injected before React hydrates)
•	Auto-seeded demo data — 6 months of realistic transactions on first load so the UI is never empty
•	Full localStorage persistence — survives browser refresh, zero backend

2. Design Choices & Why
2.1  Component Architecture
The app uses a single custom hook — 
useFinanceStore — as the sole source of truth. Every component receives what it needs via props, keeping data flow explicit and easy to follow. No context providers, no external state library.

useFinanceStore  →  page.tsx  →  individual components
This keeps the component tree shallow and removes the need for prop-drilling workarounds.

2.2  Balance Health Colouring
Rather than a fixed colour, the balance card colour is computed from the savings rate (balance ÷ income):

Savings Rate	Status & Colour
< 10 %	🔴  Critical — red
10 – 25 %	🟡  Warning — amber
25 – 50 %	🟢  On track — emerald
> 50 %	🩵  Healthy — teal

This gives users an instant visual health signal without needing to read numbers carefully.

2.3  Clickable Bar Chart → Month Drill-Down
Clicking a bar in the 6-month chart sets selectedMonth in page state. All five lower sections — summary cards, donut chart, budget tracker, transaction list — are already filtered by selectedMonth, so they update instantly with zero extra code.

2.4  Typography & Visual Tone
Choice	Rationale
DM Sans (body)	Friendly but professional; less overused than Inter
DM Mono (all numbers)	Tabular figures prevent layout shifts when amounts change
Warm off-white surface (#F8F7F4)	Softer than pure white; reduces eye strain
CSS variables for every colour	Single source of truth; dark mode is a free variable swap

2.5  localStorage Schema
Five keys, all prefixed 
pfs_ to avoid collisions:

Key	Contents
pfs_transactions	Transaction[] — all income & expense records
pfs_categories	Category[] — default + custom categories
pfs_budgets	Budget[] — per-category monthly limits
pfs_seeded	Flag — prevents re-seeding on subsequent loads
pfs_theme	"light" | "dark" — persists theme preference

3. What I'd Improve With More Time
3.1  Features
•	Recurring transactions — mark a transaction as monthly recurring and auto-populate future months
•	CSV / bank import — drag-and-drop a bank statement and auto-parse transactions
•	Multi-currency support — live exchange rates via an open API
•	Goals / savings pots — set a savings target and track progress alongside budgets
•	Trend line on bar chart — overlay a rolling average to smooth noise

3.2  Engineering
•	Move to Zustand or React Context — the hook works, but as features grow, a proper store prevents prop chains
•	Unit tests — especially for getMonthSummary(), getBalanceHealth(), and the storage hook
•	Optional cloud sync — a lightweight backend (Supabase / PlanetScale) so data survives clearing the browser
•	Animation polish — Framer Motion for page-level transitions and chart entrance animations

4. Challenges Faced
4.1  Flash of Incorrect Theme
Next.js renders on the server, which has no concept of the user's stored theme. Without intervention, the page flashes white before React hydrates and reads localStorage. The fix was injecting a small synchronous <script> tag in the <head> — before any CSS or JS loads — that reads pfs_theme and adds the dark class to <html> immediately. This runs before the browser paints, so the flash never appears.


4.2  Bar Chart Click → Month Navigation
Recharts' onClick on <BarChart> returns a synthetic event with activePayload nested several levels deep. Mapping each bar's monthKey into the data payload (not just the display label) was required so clicking "Mar" correctly sets "2025-03" rather than the short label string. This small data-shape decision made the drill-down feature trivial to implement.

Time spent - 3days

FinSnap  ·  Next.js 14 + TypeScript + Tailwind  ·  Built by Olubanwo Ayomide
