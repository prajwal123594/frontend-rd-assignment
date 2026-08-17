import React from 'react';
import { Transaction } from '../types.ts';
import { Tag } from 'lucide-react';

interface TransactionRowProps {
  tx: Transaction;
}

const getStatusBadge = (status: Transaction['status']) => {
  switch (status) {
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300/50"></span>
          Completed
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ring-2 ring-amber-300/50"></span>
          Pending
        </span>
      );
    case 'Cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-rose-300/50"></span>
          Cancelled
        </span>
      );
  }
};

const getCategoryColor = (category: Transaction['category']) => {
  switch (category) {
    case 'Electronics':
      return 'bg-blue-50 text-blue-700 border-blue-200/60';
    case 'Clothing':
      return 'bg-purple-50 text-purple-700 border-purple-200/60';
    case 'Food':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    case 'Home':
      return 'bg-amber-50 text-amber-700 border-amber-200/60';
    case 'Other':
      return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name.slice(0, 2) || 'CU').toUpperCase();
};

const formatDate = (isoString: string) => {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
};

export const TransactionRow: React.FC<TransactionRowProps> = React.memo(({ tx }) => {
  return (
    <tr
      id={`transaction-row-${tx.id}`}
      className="hover:bg-slate-50/90 transition-colors group"
    >
      {/* Order ID */}
      <td className="py-3.5 px-6 font-mono text-xs font-semibold text-slate-900 whitespace-nowrap">
        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80 text-slate-800">
          {tx.id}
        </span>
      </td>

      {/* Customer */}
      <td className="py-3.5 px-6 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
            {getInitials(tx.customer)}
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-sm">{tx.customer}</div>
            <div className="text-[11px] text-slate-400 font-normal">Customer Record</div>
          </div>
        </div>
      </td>

      {/* Product & Category */}
      <td className="py-3.5 px-6 min-w-[220px]">
        <div className="font-medium text-slate-800 text-sm leading-snug line-clamp-1">{tx.product}</div>
        <div className="inline-flex items-center gap-1 mt-1">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${getCategoryColor(tx.category)}`}>
            <Tag className="w-3 h-3 opacity-70" />
            <span>{tx.category}</span>
          </span>
        </div>
      </td>

      {/* Amount */}
      <td className="py-3.5 px-6 text-right font-mono font-bold text-slate-900 whitespace-nowrap tabular-nums text-sm">
        ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>

      {/* Date */}
      <td className="py-3.5 px-6 text-xs text-slate-500 font-mono whitespace-nowrap tabular-nums">
        {formatDate(tx.date)}
      </td>

      {/* Status */}
      <td className="py-3.5 px-6 text-center whitespace-nowrap">
        {getStatusBadge(tx.status)}
      </td>
    </tr>
  );
});

TransactionRow.displayName = 'TransactionRow';
