import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './charts.js';

const chartColour = '#A85C3C';
const grid = '#e6e5e1';

function formatMoney(value) {
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
}

function formatAxis(value, metric) {
  if (metric === 'transactions') return Math.round(value).toLocaleString('id-ID');
  if (value >= 1_000_000) return `Rp ${Number((value / 1_000_000).toFixed(1)).toLocaleString('id-ID')} jt`;
  if (value >= 1_000) return `Rp ${Math.round(value / 1_000).toLocaleString('id-ID')} rb`;
  return `Rp ${Math.round(value).toLocaleString('id-ID')}`;
}

function monthLabel(period) {
  const date = new Date(`${period}-01T12:00:00`);
  return new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(date);
}

function monthKey(date) {
  return new Intl.DateTimeFormat('sv-SE', { year: 'numeric', month: '2-digit', timeZone: 'Asia/Jakarta' }).format(date);
}

function safeOrderDate(order) {
  if (order.createdAt) {
    const d = new Date(order.createdAt);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (order.date) {
    const d = new Date(order.date);
    if (!Number.isNaN(d.getTime())) return d;
    const idMonths = {
      jan: '01', feb: '02', mar: '03', apr: '04', mei: '05', jun: '06',
      jul: '07', agu: '08', ags: '08', sep: '09', okt: '10', nov: '11', des: '12'
    };
    const parts = String(order.date).toLowerCase().split(/\s+/);
    if (parts.length >= 3) {
      const day = parts[0].padStart(2, '0');
      const monthStr = parts[1].slice(0, 3);
      const year = parts[2];
      const month = idMonths[monthStr] || '10';
      const parsed = new Date(`${year}-${month}-${day}T12:00:00`);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  }
  return new Date();
}

function buildDemoSeries(orders) {
  const monthBase = new Date();
  const periods = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(monthBase.getFullYear(), monthBase.getMonth() - (5 - index), 1);
    return { period: monthKey(date), turnover: 0, transactions: 0 };
  });

  orders.filter(order => ['diambil', 'selesai'].includes(order.status)).forEach(order => {
    const date = safeOrderDate(order);
    if (Number.isNaN(date.getTime())) return;
    const period = monthKey(date);
    const month = periods.find(row => row.period === period);
    if (!month) return;
    month.turnover += Number(order.total) || 0;
    month.transactions += 1;
  });

  return periods;
}

export default function MonthlyPerformanceChart({ stats, orders, dataSource }) {
  const [metric, setMetric] = useState('turnover');
  const chartRef = useRef(null);
  const apiSeries = Array.isArray(stats?.monthlyPerformance) ? stats.monthlyPerformance : null;
  const series = useMemo(() => {
    if (apiSeries?.length) return apiSeries;
    return dataSource === 'demo' ? buildDemoSeries(orders) : [];
  }, [apiSeries, orders, dataSource]);
  const values = useMemo(() => series.map(row => Math.max(0, Number(row[metric]) || 0)), [series, metric]);
  const current = series[series.length - 1];
  const currentLabel = current ? new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date(`${current.period}-01T12:00:00`)) : 'Belum tersedia';
  const formatValue = useCallback(value => metric === 'turnover' ? formatMoney(value) : `${Math.round(value).toLocaleString('id-ID')} pesanan`, [metric]);
  const formatTick = useCallback(value => formatAxis(value, metric), [metric]);

  useEffect(() => {
    if (!chartRef.current || !series.length || !window.Charts) return undefined;
    window.Charts.line(chartRef.current, {
      labels: series.map(row => monthLabel(row.period)),
      series: [{ name: metric === 'turnover' ? 'Omzet tuntas' : 'Pesanan tuntas', values, colour: chartColour }],
      format: formatValue,
      tickFormat: formatTick,
      height: 180,
      xAt: series.map((_, index) => index),
    });
    const chartElement = chartRef.current;
    return () => chartElement._chartsObserver?.disconnect();
  }, [series, values, metric, formatValue, formatTick]);

  return (
    <section className="rounded-lg border border-[#deddd8] bg-white p-4 sm:p-5" aria-labelledby="monthly-performance-title">
      <div>
        <h3 id="monthly-performance-title" className="text-base font-semibold text-[#232220]">Perputaran transaksi warga</h3>
        <p className="mt-1 text-sm text-[#5c5b57]">Enam bulan terakhir · pesanan yang sudah diambil atau selesai</p>
      </div>

      <div className="mt-4 grid grid-cols-2 border-b border-[#deddd8]" aria-label="Pilih metrik grafik">
        {[
          ['turnover', 'Omzet tuntas'],
          ['transactions', 'Pesanan tuntas'],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={metric === value}
            onClick={() => setMetric(value)}
            className={`flex min-h-[62px] flex-col items-start justify-center border-b-2 px-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A85C3C] sm:px-4 ${metric === value ? 'border-[#232220]' : 'border-transparent hover:bg-[#f7f7f5]'}`}
          >
            <span className={`text-xs sm:text-sm ${metric === value ? 'font-medium text-[#343431]' : 'text-[#5c5b57]'}`}>{label}</span>
            <span className={`mt-1 text-lg tabular-nums sm:text-xl ${metric === value ? 'font-semibold text-[#232220]' : 'font-medium text-[#343431]'}`}>
              {!current ? '—' : value === 'turnover' ? formatMoney(Number(current.turnover) || 0) : (Number(current.transactions) || 0).toLocaleString('id-ID')}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-[#343431]">{metric === 'turnover' ? 'Omzet per bulan' : 'Pesanan tuntas per bulan'}</p>
        <p className="text-xs text-[#5c5b57]">{currentLabel}</p>
      </div>

      {series.length ? (
        <div ref={chartRef} className="monthly-performance-chart mt-2 w-full" style={{ '--chart-1': chartColour, '--grid': grid, '--ink': '#343431', '--axis-ink': '#5c5b57', '--surface': '#ffffff' }} />
      ) : (
        <p className="mt-4 border-t border-[#e6e5e1] pt-4 text-sm text-[#5c5b57">Riwayat grafik belum tersedia dari backend.</p>
      )}
    </section>
  );
}
