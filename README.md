# Performance-Critical Data Visualization Dashboard

## Overview
A high-performance, responsive data visualization dashboard designed for Frontend R&D benchmarks. The application generates and manages a live dataset of **50,000+ realistic transaction records** completely in-memory, delivering fluid 60 FPS interactions through debounced querying, memoized computations, and virtual DOM budgeting.

## Features
- **In-Memory Dataset Generation**: Generates 50,000 realistic e-commerce transactions across diverse categories (`Electronics`, `Clothing`, `Food`, `Home`, `Other`) and transaction statuses (`Completed`, `Pending`, `Cancelled`) with reproducible seeding.
- **Dynamic KPI Cards**: Real-time aggregated metrics displaying Total Revenue, Total Orders, Total Unique Users, and Completed Conversion Rate with directional trend indicators.
- **Interactive Revenue Analytics**: Chart.js line chart with smooth bezier curves and custom gradient fills displaying 7-day gross sales trends, 7-day total revenue, daily average, and peak day metrics.
- **High-Throughput Transaction Table**:
  - **Debounced Search**: 200ms debounced multi-field searching across customer names and product descriptions with live sync feedback and instant clear controls.
  - **Multi-Parameter Filtering**: Instant category and status filtering.
  - **Multi-Column Sorting**: Ascending and descending sorting on Customer, Amount, and Date.
  - **Budgeted Pagination**: 20 rows per page with page jump boundaries, total records counter, and previous/next navigation.
- **Performance Telemetry Monitor**: Live diagnostic card displaying total records, filtered records, DOM rendered row counts, and real-time JavaScript compute latency (`performance.now()`).
- **Responsive Architecture**:
  - **Desktop**: Persistent dark sidebar and multi-column analytics grid.
  - **Tablet**: Flexible multi-column wrapping and adaptive chart views.
  - **Mobile**: Sliding navigation drawer with backdrop blur, scrollable transaction tables, and stacked filter controls.

## Technology Stack
- **Framework**: React 19 with TypeScript
- **Bundler & Dev Server**: Vite 6
- **Styling**: Tailwind CSS v4
- **Charting**: Chart.js v4 & react-chartjs-2
- **Icons**: Lucide React

## Performance Optimizations
1. **Debounced Search Pipeline (`200ms`)**:
   - Isolates keystroke input state from high-frequency dataset filtering, preventing UI thread blocking.
2. **Fixed DOM Rendering Budget (20 Rows / Page)**:
   - Slices only the active page subset (20 items) into the DOM, avoiding expensive DOM tree bloat from 50,000 elements.
3. **Targeted Memoization (`useMemo` & `useCallback`)**:
   - `useMemo` caches filtered/sorted arrays and dashboard aggregate computations, re-evaluating only when dependent filters or sort parameters change.
   - `useCallback` stabilizes event handlers across filter inputs, sort columns, pagination triggers, and dataset refreshes.
4. **Component-Level `React.memo`**:
   - `TransactionRow`, `KpiCard`, `RevenueChart`, `TransactionTable`, `Header`, and `Sidebar` are memoized to eliminate redundant component subtree re-renders.
5. **Algorithmic Optimizations**:
   - Single-pass `O(N)` metric computations (`computeDashboardStats`) using `Set` for unique users and `Map` for date aggregations.

## Project Structure
```
├── index.html
├── metadata.json
├── package.json
├── README.md
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types.ts
    ├── dataGenerator.ts
    └── components/
        ├── Header.tsx
        ├── Sidebar.tsx
        ├── KpiCard.tsx
        ├── RevenueChart.tsx
        ├── TransactionTable.tsx
        └── TransactionRow.tsx
```

## How to Run

```bash
npm install
npm run dev
```

The application dev server binds to `http://localhost:3000`.

## Production Build

```bash
npm run build
```

The production output will be generated in the `dist/` directory. To test the production preview locally:

```bash
npm run preview
```

## Future Improvements
- **Web Worker Offloading**: Moving dataset generation and complex multi-column filter operations to a dedicated Web Worker thread for zero-latency background execution.
- **Virtualized Window Scrolling**: Implementing infinite-scroll virtualization (e.g. `@tanstack/react-virtual`) as an alternative viewing mode to fixed pagination.
- **Multi-Metric Comparative Charts**: Adding secondary datasets for order volume and category breakdown distributions.
- **CSV / Excel Export**: Client-side streaming export for filtered transaction subsets.
