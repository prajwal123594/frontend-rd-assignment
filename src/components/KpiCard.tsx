import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import { KpiMetric } from '../types.ts';

interface KpiCardProps {
  metric: KpiMetric;
}

export const KpiCard: React.FC<KpiCardProps> = React.memo(({ metric }) => {
  const getIcon = (iconName: KpiMetric['iconName']) => {
    switch (iconName) {
      case 'dollar-sign':
        return <DollarSign className="w-5 h-5 text-indigo-600" />;
      case 'shopping-bag':
        return <ShoppingBag className="w-5 h-5 text-sky-600" />;
      case 'users':
        return <Users className="w-5 h-5 text-violet-600" />;
      case 'trending-up':
        return <TrendingUp className="w-5 h-5 text-emerald-600" />;
    }
  };

  const getIconBg = (iconName: KpiMetric['iconName']) => {
    switch (iconName) {
      case 'dollar-sign':
        return 'bg-indigo-50/80 border-indigo-100/80';
      case 'shopping-bag':
        return 'bg-sky-50/80 border-sky-100/80';
      case 'users':
        return 'bg-violet-50/80 border-violet-100/80';
      case 'trending-up':
        return 'bg-emerald-50/80 border-emerald-100/80';
    }
  };

  return (
    <div
      id={`kpi-card-${metric.id}`}
      className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all duration-150"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
            {metric.title}
          </p>
          <p 
            id={`kpi-value-${metric.id}`}
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5 tracking-tight font-mono tabular-nums"
          >
            {metric.value}
          </p>
        </div>
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 shadow-2xs ${getIconBg(metric.iconName)}`}>
          {getIcon(metric.iconName)}
        </div>
      </div>

      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-full text-[11px] font-mono ${
              metric.isPositive
                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                : 'text-rose-700 bg-rose-50 border border-rose-200/60'
            }`}
          >
            {metric.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {metric.change}
          </span>
          <span className="text-slate-400 text-[11px] font-medium">{metric.period}</span>
        </div>
      </div>
    </div>
  );
});

KpiCard.displayName = 'KpiCard';
