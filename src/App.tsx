import React, { useState, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { KpiCard } from './components/KpiCard.tsx';
import { RevenueChart } from './components/RevenueChart.tsx';
import { TransactionTable } from './components/TransactionTable.tsx';
import { generateTransactions, computeDashboardStats } from './dataGenerator.ts';
import { KpiMetric } from './types.ts';

export default function App() {
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [dataVersion, setDataVersion] = useState<number>(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Generate 50,000 realistic transactions programmatically in memory
  const allTransactions = useMemo(() => {
    return generateTransactions(50000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataVersion]);

  // Compute all metrics and aggregations from the 50,000 transaction dataset efficiently
  const stats = useMemo(() => {
    return computeDashboardStats(allTransactions);
  }, [allTransactions]);

  const handleRefresh = useCallback(() => {
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setDataVersion((v) => v + 1);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setMobileSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  // Build KPI card metrics dynamically from the actual 50,000 records
  const kpiMetrics: KpiMetric[] = useMemo(() => [
    {
      id: 'kpi-revenue',
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: '+14.2%',
      isPositive: true,
      period: 'from 50k transactions',
      iconName: 'dollar-sign',
    },
    {
      id: 'kpi-orders',
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      change: '+8.7%',
      isPositive: true,
      period: 'total records',
      iconName: 'shopping-bag',
    },
    {
      id: 'kpi-users',
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+5.3%',
      isPositive: true,
      period: 'unique customers',
      iconName: 'users',
    },
    {
      id: 'kpi-conversion',
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      change: '+1.2%',
      isPositive: true,
      period: 'completed order ratio',
      iconName: 'trending-up',
    },
  ], [stats]);

  return (
    <div id="app-root" className="min-h-screen bg-slate-50/70 flex text-slate-800 font-sans antialiased">
      {/* 1. Sidebar with Desktop persistent + Mobile drawer */}
      <Sidebar isOpen={mobileSidebarOpen} onClose={handleCloseSidebar} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 2. Header */}
        <Header 
          onRefresh={handleRefresh} 
          lastUpdated={lastUpdated} 
          onToggleSidebar={handleToggleSidebar} 
        />

        {/* Dashboard Main Content */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* 3. Four KPI Cards calculated from the generated dataset */}
          <section id="kpi-metrics-grid" aria-label="Key Performance Indicators">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {kpiMetrics.map((kpi) => (
                <KpiCard key={kpi.id} metric={kpi} />
              ))}
            </div>
          </section>

          {/* 4. Line Chart: Revenue over the last 7 days calculated from the generated dataset */}
          <section id="revenue-analytics-section" aria-label="Revenue Trend Analysis">
            <RevenueChart data={stats.revenue7Days} />
          </section>

          {/* 5. Transaction Table with Search, Filtering, Sorting, 20/page Pagination, and Performance Telemetry */}
          <section id="transactions-overview-section" aria-label="Recent Transactions">
            <TransactionTable 
              transactions={allTransactions} 
              totalDatasetCount={stats.totalOrders}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
