import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Transaction } from '../types.ts';
import { TransactionRow } from './TransactionRow.tsx';
import { 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Filter,
  RotateCcw,
  Zap,
  Cpu,
  Layers,
  Database,
  SlidersHorizontal
} from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  totalDatasetCount?: number;
}

type SortField = 'customer' | 'amount' | 'date';
type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 20;
const DEBOUNCE_DELAY_MS = 200;

export const TransactionTable: React.FC<TransactionTableProps> = React.memo(({ 
  transactions,
  totalDatasetCount = 50000 
}) => {
  // 1. Search with debounce state
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [isDebouncing, setIsDebouncing] = useState<boolean>(false);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Sorting state (default: Date descending)
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Performance telemetry state
  const [processingTimeMs, setProcessingTimeMs] = useState<number>(0);

  // Debounce Effect
  useEffect(() => {
    if (searchInput === debouncedSearch) {
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setIsDebouncing(false);
    }, DEBOUNCE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [searchInput, debouncedSearch]);

  // Reset pagination to page 1 whenever filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedStatus, sortField, sortDirection]);

  // Optimized Filter & Sort across 50,000 in-memory items
  const filteredAndSortedTransactions = useMemo(() => {
    const t0 = performance.now();
    const term = debouncedSearch.trim().toLowerCase();

    // 1. Filter
    const filtered = transactions.filter((tx) => {
      if (selectedCategory !== 'All' && tx.category !== selectedCategory) {
        return false;
      }
      if (selectedStatus !== 'All' && tx.status !== selectedStatus) {
        return false;
      }
      if (term) {
        const matchesCustomer = tx.customer.toLowerCase().includes(term);
        const matchesProduct = tx.product.toLowerCase().includes(term);
        if (!matchesCustomer && !matchesProduct) {
          return false;
        }
      }
      return true;
    });

    // 2. Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'customer') {
        comparison = a.customer.localeCompare(b.customer);
      } else if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    const t1 = performance.now();
    setProcessingTimeMs(Math.round((t1 - t0) * 100) / 100);

    return filtered;
  }, [transactions, debouncedSearch, selectedCategory, selectedStatus, sortField, sortDirection]);

  // Pagination calculations
  const totalFilteredRecords = filteredAndSortedTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredRecords / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  // Slice ONLY 20 items for DOM rendering
  const paginatedTransactions = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredAndSortedTransactions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredAndSortedTransactions, safeCurrentPage]);

  // Event handlers
  const handleSort = useCallback((field: SortField) => {
    setSortField((currentField) => {
      if (currentField === field) {
        setSortDirection((currentDir) => (currentDir === 'asc' ? 'desc' : 'asc'));
        return currentField;
      } else {
        setSortDirection(field === 'customer' ? 'asc' : 'desc');
        return field;
      }
    });
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSortField('date');
    setSortDirection('desc');
    setCurrentPage(1);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput('');
    setDebouncedSearch('');
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const renderSortIndicator = useCallback((field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600 font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600 font-bold" />
    );
  }, [sortField, sortDirection]);

  const hasActiveFilters = searchInput !== '' || debouncedSearch !== '' || selectedCategory !== 'All' || selectedStatus !== 'All';

  const startIndex = totalFilteredRecords === 0 ? 0 : (safeCurrentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(safeCurrentPage * PAGE_SIZE, totalFilteredRecords);

  return (
    <div
      id="transactions-section"
      className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden"
    >
      {/* 1. Header & Controls Section */}
      <div className="p-5 sm:p-6 border-b border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Transaction Management
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/80 font-mono">
                {totalFilteredRecords.toLocaleString()} of {totalDatasetCount.toLocaleString()} Records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              High-throughput client-side filtering, sorting, and pagination with fixed 20-row DOM rendering budget
            </p>
          </div>

          {hasActiveFilters && (
            <button
              id="reset-filters-btn"
              onClick={handleResetFilters}
              type="button"
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          {/* Search Bar */}
          <div className="sm:col-span-6 lg:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="transaction-search-input"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search customer or product..."
              className="w-full pl-9 pr-14 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300/80 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-2xs"
            />
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
              {isDebouncing && (
                <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                  sync...
                </span>
              )}
              {searchInput && (
                <button
                  id="clear-search-btn"
                  onClick={handleClearSearch}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
                  type="button"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3 lg:col-span-3">
            <div className="relative">
              <select
                id="category-filter-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300/80 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-2xs font-medium"
                aria-label="Filter by Category"
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Food">Food</option>
                <option value="Home">Home</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3 lg:col-span-4">
            <div className="relative">
              <select
                id="status-filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300/80 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-2xs font-medium"
                aria-label="Filter by Status"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Performance Information Section */}
        <div 
          id="performance-telemetry-panel" 
          className="rounded-xl bg-slate-950 text-slate-300 p-4 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner"
        >
          <div className="flex items-center gap-2.5 font-medium text-white">
            <div className="w-6 h-6 rounded bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div>
              <span className="font-semibold text-slate-100 text-xs sm:text-sm">Performance Telemetry</span>
              <span className="ml-2 text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-full font-mono border border-slate-700">
                200ms Debounced
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 font-mono text-[11px]">
            <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Total Records</div>
              <div className="text-slate-100 font-bold text-xs">{totalDatasetCount.toLocaleString()}</div>
            </div>

            <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-mono">Filtered</div>
              <div className="text-emerald-400 font-bold text-xs">{totalFilteredRecords.toLocaleString()}</div>
            </div>

            <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] uppercase font-mono">DOM Rows</div>
              <div className="text-amber-300 font-bold text-xs">{paginatedTransactions.length} / 20 max</div>
            </div>

            <div className="bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800 flex flex-col justify-center">
              <div className="text-slate-400 text-[10px] uppercase font-mono flex items-center gap-1">
                <Zap className="w-3 h-3 text-indigo-400" />
                <span>Compute Latency</span>
              </div>
              <div className="text-indigo-300 font-bold text-xs">{processingTimeMs > 0 ? `${processingTimeMs} ms` : '< 1 ms'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table Data */}
      <div className="overflow-x-auto">
        <table id="transactions-table" className="w-full text-left text-sm text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider select-none font-mono">
            <tr>
              <th scope="col" className="py-3.5 px-6">
                Order ID
              </th>
              {/* Sortable: Customer */}
              <th 
                scope="col" 
                id="sort-customer-th"
                onClick={() => handleSort('customer')}
                className="py-3.5 px-6 cursor-pointer hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span className={sortField === 'customer' ? 'text-indigo-700 font-bold' : ''}>Customer</span>
                  {renderSortIndicator('customer')}
                </div>
              </th>
              <th scope="col" className="py-3.5 px-6">
                Product & Category
              </th>
              {/* Sortable: Amount */}
              <th 
                scope="col" 
                id="sort-amount-th"
                onClick={() => handleSort('amount')}
                className="py-3.5 px-6 text-right cursor-pointer hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span className={sortField === 'amount' ? 'text-indigo-700 font-bold' : ''}>Amount</span>
                  {renderSortIndicator('amount')}
                </div>
              </th>
              {/* Sortable: Date */}
              <th 
                scope="col" 
                id="sort-date-th"
                onClick={() => handleSort('date')}
                className="py-3.5 px-6 cursor-pointer hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span className={sortField === 'date' ? 'text-indigo-700 font-bold' : ''}>Date</span>
                  {renderSortIndicator('date')}
                </div>
              </th>
              <th scope="col" className="py-3.5 px-6 text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2.5 max-w-md mx-auto px-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <Filter className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-slate-800 text-base">No matching transactions found</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      No records matched your search query &quot;{searchInput}&quot; with the selected category and status filters.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset All Filters
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Pagination Footer */}
      <div 
        id="table-pagination-footer" 
        className="p-4 sm:px-6 border-t border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600"
      >
        <div id="pagination-results-count" className="font-medium">
          Showing <span className="font-bold text-slate-900">{startIndex}</span> to{' '}
          <span className="font-bold text-slate-900">{endIndex}</span> of{' '}
          <span className="font-bold text-slate-900">{totalFilteredRecords.toLocaleString()}</span> entries
        </div>

        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            id="prev-page-btn"
            onClick={handlePreviousPage}
            disabled={safeCurrentPage <= 1}
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Current Page / Total Pages Indicator */}
          <div id="page-indicator" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono text-xs font-medium text-slate-800 shadow-2xs">
            Page <span className="font-bold text-indigo-600">{safeCurrentPage}</span> of{' '}
            <span className="font-bold text-slate-900">{totalPages.toLocaleString()}</span>
          </div>

          {/* Next Button */}
          <button
            id="next-page-btn"
            onClick={handleNextPage}
            disabled={safeCurrentPage >= totalPages}
            type="button"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});

TransactionTable.displayName = 'TransactionTable';
