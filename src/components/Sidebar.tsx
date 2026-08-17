import React from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  ShieldCheck, 
  Database,
  X,
  Gauge
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = React.memo(({ isOpen = false, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside 
        id="main-sidebar" 
        className={`
          fixed md:sticky top-0 left-0 z-50 md:z-auto
          w-64 bg-slate-950 text-slate-300 flex flex-col flex-shrink-0 h-screen
          border-r border-slate-800/80 transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-semibold ring-1 ring-indigo-400/30">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white tracking-tight">DataEngine R&D</span>
              <span className="text-[10px] text-slate-400 font-mono">v1.0 • High-Perf</span>
            </div>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Section */}
        <div className="p-4 flex-1 flex flex-col gap-6 overflow-y-auto">
          <div>
            <div className="px-3 mb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase font-mono">
              Workspace
            </div>
            <nav className="space-y-1">
              <a
                id="nav-dashboard-link"
                href="#dashboard"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white shadow-sm transition-all hover:bg-indigo-500"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-200" />
                <span>Dashboard</span>
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-indigo-400/40"></span>
              </a>
            </nav>
          </div>

          {/* Dataset & Engine Info Box */}
          <div className="mt-auto space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-medium mb-1.5">
                <Database className="w-4 h-4 text-indigo-400" />
                <span className="text-slate-200 font-semibold">In-Memory Engine</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Processing 50,000 synthetic records with instantaneous client-side grouping.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-slate-200 font-semibold">Render Pipeline Active</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Zero-overhead virtual budgeting (20 DOM rows per page).
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>Telemetry Mode</span>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            60 FPS Target
          </span>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
