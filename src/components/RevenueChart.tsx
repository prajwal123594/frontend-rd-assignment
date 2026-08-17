import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { DailyRevenue } from '../types.ts';
import { TrendingUp, BarChart2, DollarSign } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface RevenueChartProps {
  data: DailyRevenue[];
}

export const RevenueChart: React.FC<RevenueChartProps> = React.memo(({ data }) => {
  const { labels, revenues, total7DayRevenue, avgDailyRevenue, peakRevenue } = useMemo(() => {
    const lbls = data.map((item) => `${item.dayName} (${item.date.slice(5)})`);
    const revs = data.map((item) => item.revenue);
    const total = revs.reduce((acc, curr) => acc + curr, 0);
    const avg = revs.length > 0 ? Math.round(total / revs.length) : 0;
    const peak = revs.length > 0 ? Math.max(...revs) : 0;
    return {
      labels: lbls,
      revenues: revs,
      total7DayRevenue: total,
      avgDailyRevenue: avg,
      peakRevenue: peak,
    };
  }, [data]);

  const chartData: ChartData<'line'> = useMemo(() => ({
    labels,
    datasets: [
      {
        label: 'Daily Revenue',
        data: revenues,
        borderColor: '#4f46e5', // Indigo-600
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) {
            return 'rgba(79, 70, 229, 0.08)';
          }
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(79, 70, 229, 0.28)');
          gradient.addColorStop(0.7, 'rgba(79, 70, 229, 0.04)');
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0.00)');
          return gradient;
        },
        fill: true,
        tension: 0.38,
        borderWidth: 2.5,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4f46e5',
        pointBorderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6.5,
        pointHoverBackgroundColor: '#4f46e5',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2.5,
      },
    ],
  }), [labels, revenues]);

  const options: ChartOptions<'line'> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        borderColor: '#334155',
        borderWidth: 1,
        padding: { top: 10, bottom: 10, left: 14, right: 14 },
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          size: 12,
          weight: 'bold',
          family: 'system-ui, sans-serif',
        },
        bodyFont: {
          size: 13,
          family: 'ui-monospace, SFMono-Regular, monospace',
        },
        callbacks: {
          label: (context) => {
            const raw = context.parsed.y;
            return `Gross Revenue: $${raw?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
            family: 'system-ui, sans-serif',
          },
          padding: 8,
        },
      },
      y: {
        grid: {
          color: '#f1f5f9',
        },
        border: {
          dash: [4, 4],
          color: 'transparent',
        },
        ticks: {
          color: '#64748b',
          font: {
            size: 11,
            family: 'ui-monospace, SFMono-Regular, monospace',
          },
          padding: 8,
          callback: (value) => `$${Number(value).toLocaleString()}`,
        },
        beginAtZero: false,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  }), []);

  return (
    <div 
      id="revenue-chart-section" 
      className="bg-white rounded-xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col"
    >
      {/* Chart Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Revenue Over the Last 7 Days
            </h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
              <TrendingUp className="w-3 h-3" />
              +14.2% Trend
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Aggregated gross sales telemetry rendered directly from in-memory transaction logs
          </p>
        </div>

        {/* Aggregate Micro-stats */}
        <div className="flex items-center gap-3 sm:gap-5 text-xs flex-wrap">
          <div className="flex flex-col">
            <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider font-semibold">7-Day Total</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums">
              ${total7DayRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="border-l border-slate-200 pl-3 sm:pl-5 flex flex-col">
            <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider font-semibold">Daily Average</span>
            <span className="text-sm sm:text-base font-bold text-slate-900 font-mono tabular-nums">
              ${avgDailyRevenue.toLocaleString()}
            </span>
          </div>
          <div className="hidden sm:flex border-l border-slate-200 pl-3 sm:pl-5 flex-col">
            <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider font-semibold">Peak Day</span>
            <span className="text-sm sm:text-base font-bold text-indigo-600 font-mono tabular-nums">
              ${peakRevenue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Container */}
      <div 
        id="revenue-chart-container" 
        className="w-full h-72 sm:h-80 pt-4"
      >
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
});

RevenueChart.displayName = 'RevenueChart';
