import React, { useState } from 'react';
import { Clock, RefreshCw, Menu, Layers } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  lastUpdated?: string;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = React.memo(({ 
  onRefresh, 
  lastUpdated = 'Just now',
  onToggleSidebar
}) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefreshClick = () => {
    if (onRefresh) {
      setIsRefreshing(true);
      onRefresh();
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <header 
      id="dashboard-header" 
      className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Sidebar Hamburger Toggle */}
        <button
          id="mobile-sidebar-toggle"
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <h1 
            id="main-heading" 
            className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate"
          >
            Performance-Critical Data Visualization Dashboard
          </h1>
          <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
            <Layers className="w-3 h-3 text-indigo-500" />
            R&D Benchmark
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-slate-500 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Updated: {lastUpdated}</span>
        </div>

        {onRefresh && (
          <button
            id="refresh-dashboard-btn"
            onClick={handleRefreshClick}
            type="button"
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 active:bg-slate-100 disabled:opacity-60 transition-colors shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';
